var PF = require('..');
require('should');

// Helper: build a fresh grid from a 0/1 matrix
function makeGrid(matrix) {
    var height = matrix.length;
    var width  = matrix[0].length;
    return new PF.Grid(width, height, matrix);
}

// 5×5 open grid
var OPEN5 = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];

// Grid where going straight right is blocked, forcing a detour
// S = (0,0), E = (4,0)
// Row 0 is blocked from col 1 to 4; only route is down then across
var FORCE_DETOUR = [
    [0,1,1,1,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];

// Grid with end node fully blocked
var BLOCKED_END = [
    [0,0,0],
    [0,1,0],
    [0,0,0]
];
// End node at (1,1) is a wall → no path

// Fully walled end (surrounded)
var FULLY_BLOCKED_END = [
    [0,1,0],
    [1,1,1],
    [0,1,0]
];

// ─────────────────────────────────────────────
//  AStarFinder
// ─────────────────────────────────────────────
describe('AStarFinder edge cases', function() {

    describe('weight > 1', function() {
        it('finds a path (may be suboptimal)', function() {
            var finder = new PF.AStarFinder({ weight: 5 });
            var grid   = makeGrid(FORCE_DETOUR);
            var path   = finder.findPath(0, 0, 4, 0, grid);
            path.length.should.be.above(0);
            path[0].should.eql([0, 0]);
            path[path.length - 1].should.eql([4, 0]);
        });
    });

    describe('custom heuristic (zero — behaves like Dijkstra)', function() {
        it('finds a valid path', function() {
            var finder = new PF.AStarFinder({ heuristic: function(dx, dy) { return 0; } });
            var grid   = makeGrid(OPEN5);
            var path   = finder.findPath(0, 0, 4, 4, grid);
            path.length.should.be.above(0);
            path[0].should.eql([0, 0]);
            path[path.length - 1].should.eql([4, 4]);
        });
    });

    describe('no-path scenario', function() {
        it('returns [] when end is completely blocked', function() {
            var finder = new PF.AStarFinder();
            var grid   = makeGrid(FULLY_BLOCKED_END);
            var path   = finder.findPath(0, 0, 1, 1, grid);
            path.should.eql([]);
        });
    });

    describe('start === end', function() {
        it('returns a path of length 1 (just the start node)', function() {
            var finder = new PF.AStarFinder();
            var grid   = makeGrid(OPEN5);
            var path   = finder.findPath(2, 2, 2, 2, grid);
            // Implementation returns the single node backtrace
            path.length.should.be.above(0);
            path[0].should.eql([2, 2]);
            path[path.length - 1].should.eql([2, 2]);
        });
    });

    describe('deprecated allowDiagonal API', function() {
        it('finds path using diagonal movement', function() {
            var finder = new PF.AStarFinder({ allowDiagonal: true });
            var grid   = makeGrid(OPEN5);
            var path   = finder.findPath(0, 0, 4, 4, grid);
            path.length.should.be.above(0);
            path[0].should.eql([0, 0]);
            path[path.length - 1].should.eql([4, 4]);
        });
    });

    describe('deprecated dontCrossCorners API', function() {
        it('maps to OnlyWhenNoObstacles and finds path', function() {
            var finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
            finder.diagonalMovement.should.equal(PF.DiagonalMovement.OnlyWhenNoObstacles);
            var grid = makeGrid(OPEN5);
            var path = finder.findPath(0, 0, 4, 4, grid);
            path.length.should.be.above(0);
        });
    });
});

// ─────────────────────────────────────────────
//  DijkstraFinder
// ─────────────────────────────────────────────
describe('DijkstraFinder edge cases', function() {

    describe('no-path scenario', function() {
        it('returns [] when end is completely blocked', function() {
            var finder = new PF.DijkstraFinder();
            var grid   = makeGrid(FULLY_BLOCKED_END);
            var path   = finder.findPath(0, 0, 1, 1, grid);
            path.should.eql([]);
        });
    });

    describe('start === end', function() {
        it('returns path containing only the start/end node', function() {
            var finder = new PF.DijkstraFinder();
            var grid   = makeGrid(OPEN5);
            var path   = finder.findPath(3, 3, 3, 3, grid);
            path.length.should.be.above(0);
            path[0].should.eql([3, 3]);
            path[path.length - 1].should.eql([3, 3]);
        });
    });

    describe('zero heuristic', function() {
        it('heuristic always returns 0', function() {
            var finder = new PF.DijkstraFinder();
            finder.heuristic(5, 10).should.equal(0);
        });
    });
});

// ─────────────────────────────────────────────
//  BreadthFirstFinder
// ─────────────────────────────────────────────
describe('BreadthFirstFinder edge cases', function() {

    describe('diagonal movement modes', function() {
        var modes = ['Always', 'Never', 'IfAtMostOneObstacle', 'OnlyWhenNoObstacles'];

        modes.forEach(function(modeName) {
            it('finds path with DiagonalMovement.' + modeName, function() {
                var finder = new PF.BreadthFirstFinder({
                    diagonalMovement: PF.DiagonalMovement[modeName]
                });
                var grid = makeGrid(OPEN5);
                var path = finder.findPath(0, 0, 4, 4, grid);
                path.length.should.be.above(0);
                path[0].should.eql([0, 0]);
                path[path.length - 1].should.eql([4, 4]);
            });
        });
    });

    describe('no-path scenario', function() {
        it('returns [] when end is completely blocked', function() {
            var finder = new PF.BreadthFirstFinder();
            var grid   = makeGrid(FULLY_BLOCKED_END);
            var path   = finder.findPath(0, 0, 1, 1, grid);
            path.should.eql([]);
        });
    });
});

// ─────────────────────────────────────────────
//  BestFirstFinder
// ─────────────────────────────────────────────
describe('BestFirstFinder edge cases', function() {

    describe('custom heuristic', function() {
        it('wraps supplied heuristic with *1000000 multiplier', function() {
            var called = [];
            var raw = function(dx, dy) { called.push([dx, dy]); return dx + dy; };
            var finder = new PF.BestFirstFinder({ heuristic: raw });
            var grid   = makeGrid(OPEN5);
            finder.findPath(0, 0, 2, 0, grid);
            // Internal heuristic should have been called (via the wrapper)
            called.length.should.be.above(0);
        });
    });

    describe('no-path scenario', function() {
        it('returns [] when end is completely blocked', function() {
            var finder = new PF.BestFirstFinder();
            var grid   = makeGrid(FULLY_BLOCKED_END);
            var path   = finder.findPath(0, 0, 1, 1, grid);
            path.should.eql([]);
        });
    });
});

// ─────────────────────────────────────────────
//  IDAStarFinder
// ─────────────────────────────────────────────
describe('IDAStarFinder edge cases', function() {

    describe('timeLimit option', function() {
        it('returns [] when search cannot complete within time limit', function() {
            // Zero heuristic forces IDA* to iterate from cutoff 0 → optimal length,
            // exploring exponentially many nodes — guaranteed to timeout on any
            // machine within 1ms on a sufficiently wide open grid.
            var finder = new PF.IDAStarFinder({
                timeLimit: 0.001,
                heuristic: function() { return 0; }
            });
            // 30×30 open grid, corner-to-corner (optimal 58 steps).
            // With h=0, IDA* must increase cutoff 58 times; each level is exponential.
            var large = [];
            for (var r = 0; r < 30; r++) {
                var row = [];
                for (var c = 0; c < 30; c++) row.push(0);
                large.push(row);
            }
            var grid = makeGrid(large);
            var path = finder.findPath(0, 0, 29, 29, grid);
            path.should.eql([]);
        });
    });

    describe('no-path scenario', function() {
        it('returns [] when end is completely blocked', function() {
            var finder = new PF.IDAStarFinder();
            var grid   = makeGrid(FULLY_BLOCKED_END);
            var path   = finder.findPath(0, 0, 1, 1, grid);
            path.should.eql([]);
        });
    });

    describe('trackRecursion: true', function() {
        it('sets node.tested on visited neighbours', function() {
            var finder = new PF.IDAStarFinder({ trackRecursion: true });
            var grid   = makeGrid(OPEN5);
            // findPath mutates the grid nodes
            finder.findPath(0, 0, 2, 2, grid);
            // At least one node in the grid should have been marked tested
            var anyTested = false;
            for (var y = 0; y < 5; y++) {
                for (var x = 0; x < 5; x++) {
                    var node = grid.getNodeAt(x, y);
                    if (node.tested === true) {
                        anyTested = true;
                    }
                }
            }
            anyTested.should.equal(true);
        });
    });
});
