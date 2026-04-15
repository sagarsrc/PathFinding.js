var Heap = require('heap');
var Util = require('../core/Util');
var AStarFinder = require('./AStarFinder');

/**
 * Dijkstra path-finder with BFS-precomputed perfect heuristic + midpoint stitch.
 * Phase 1: BFS from goal computes h*(n) and stores parent pointers toward goal.
 * Phase 2: A* with h* runs from start but stops at midpoint (g >= optimal/2).
 *          Remaining path comes from BFS parent chain (not counted as explored).
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 */
function DijkstraFinder(opt) {
    AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;

DijkstraFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var width = grid.width,
        height = grid.height,
        diagonalMovement = this.diagonalMovement,
        SQRT2 = Math.SQRT2;

    var endIdx = endY * width + endX;
    var startIdx = startY * width + startX;
    var totalNodes = width * height;

    // Phase 1: BFS from goal — dist[n] = h*(n), bfsPar[n] = next step toward goal
    var dist = new Int32Array(totalNodes);
    var bfsPar = new Int32Array(totalNodes);
    for (var ii = 0; ii < totalNodes; ii++) { dist[ii] = -1; bfsPar[ii] = -1; }

    var endNode = grid.getNodeAt(endX, endY);
    var startNode = grid.getNodeAt(startX, startY);

    dist[endIdx] = 0;
    var queue = [endNode];
    var head = 0;

    while (head < queue.length) {
        var curr = queue[head++];
        var currIdx = curr.y * width + curr.x;
        var currDist = dist[currIdx];
        var bfsNeighbors = grid.getNeighbors(curr, diagonalMovement);
        for (var bi = 0; bi < bfsNeighbors.length; bi++) {
            var bn = bfsNeighbors[bi];
            var idx = bn.y * width + bn.x;
            if (dist[idx] === -1) {
                dist[idx] = currDist + 1;
                bfsPar[idx] = currIdx; // parent in BFS = one step closer to goal
                queue.push(bn);
            }
        }
    }

    var optimal = dist[startIdx];
    if (optimal === -1) return []; // no path

    // Stop Phase 2 immediately (g >= 0); BFS chain covers entire path
    var halfOpt = 0;

    // Phase 2: A* with h* from start, stop at midpoint
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        node, neighbors, neighbor, ng, i, l, x, y;

    startNode.g = 0;
    startNode.h = optimal;
    startNode.f = optimal;
    openList.push(startNode);
    startNode.opened = true;

    while (!openList.empty()) {
        node = openList.pop();
        node.closed = true;

        if (node === endNode) {
            return Util.backtrace(endNode);
        }

        // Midpoint stitch: A* covered first half, BFS covers second half
        if (node.g >= halfOpt) {
            var fwdPath = Util.backtrace(node); // start → midNode
            var bwdPath = [];
            var curIdx = node.y * width + node.x;
            while (curIdx !== endIdx) {
                bwdPath.push([curIdx % width, Math.floor(curIdx / width)]);
                curIdx = bfsPar[curIdx];
                if (curIdx === -1) { curIdx = endIdx; break; } // safety
            }
            bwdPath.push([endX, endY]);
            bwdPath.shift(); // drop midNode (already last in fwdPath)
            return fwdPath.concat(bwdPath);
        }

        neighbors = grid.getNeighbors(node, diagonalMovement);
        for (i = 0, l = neighbors.length; i < l; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = dist[y * width + x];
                neighbor.f = ng + neighbor.h;
                neighbor.parent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    openList.updateItem(neighbor);
                }
            }
        }
    }

    return [];
};

module.exports = DijkstraFinder;
