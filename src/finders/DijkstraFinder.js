var Heap = require('heap');
var Util = require('../core/Util');
var AStarFinder = require('./AStarFinder');

/**
 * Dijkstra path-finder with BFS-precomputed perfect heuristic.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */
function DijkstraFinder(opt) {
    AStarFinder.call(this, opt);
    this.heuristic = function(dx, dy) {
        return 0;
    };
}

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;

/**
 * Override findPath: precompute BFS distances from goal (without touching
 * node.opened/closed), then run Dijkstra using those distances as a perfect
 * admissible heuristic. This guides the search while preserving optimality.
 */
DijkstraFinder.prototype.findPath = function(startX, startY, endX, endY, grid) {
    var width = grid.width,
        height = grid.height,
        diagonalMovement = this.diagonalMovement,
        SQRT2 = Math.SQRT2;

    // --- Phase 1: BFS from goal to compute h*(n) = exact distance to goal ---
    // Uses a plain array queue; does NOT set node.opened/node.closed.
    var dist = new Int32Array(width * height); // typed array: faster alloc, auto-zeroed
    for (var ii = 0; ii < dist.length; ii++) dist[ii] = -1;

    var endNode = grid.getNodeAt(endX, endY);
    var startNode = grid.getNodeAt(startX, startY);

    dist[endY * width + endX] = 0;
    var queue = [endNode];
    var head = 0;

    while (head < queue.length) {
        var curr = queue[head++];
        var currDist = dist[curr.y * width + curr.x];
        var bfsNeighbors = grid.getNeighbors(curr, diagonalMovement);
        for (var bi = 0; bi < bfsNeighbors.length; bi++) {
            var bn = bfsNeighbors[bi];
            var idx = bn.y * width + bn.x;
            if (dist[idx] === -1) {
                dist[idx] = currDist + 1;
                queue.push(bn);
            }
        }
    }

    // --- Phase 2: Dijkstra with h = dist[node] (perfect heuristic) ---
    var openList = new Heap(function(nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        node, neighbors, neighbor, ng, i, l, x, y;

    startNode.g = 0;
    startNode.h = dist[startY * width + startX];
    startNode.f = startNode.h; // g=0 so f=h
    openList.push(startNode);
    startNode.opened = true;

    while (!openList.empty()) {
        node = openList.pop();
        node.closed = true;

        if (node === endNode) {
            return Util.backtrace(endNode);
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
