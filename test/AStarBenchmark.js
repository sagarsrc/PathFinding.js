var PF = require('..');
require('should');

// Build a 15x15 grid from a list of [x,y] wall coords
function buildGrid(walls) {
    var matrix = [];
    for (var r = 0; r < 15; r++) {
        matrix.push(new Array(15).fill(0));
    }
    walls.forEach(function(w) {
        matrix[w[1]][w[0]] = 1;
    });
    return new PF.Grid(matrix);
}

var WALLS_SPARSE = [
    [2,1],[2,2],[2,3],[2,4],[4,3],[4,4],[4,5],[4,6],
    [6,1],[6,2],[6,3],[8,5],[8,6],[8,7],[8,8],
    [10,2],[10,3],[10,4],[12,6],[12,7],[12,8],[12,9]
];

var WALLS_SPIRAL = [
    [0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[13,2],
    [13,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[13,4],
    [1,5],[11,5],[13,5],[1,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[11,6],[13,6],
    [1,7],[3,7],[9,7],[11,7],[13,7],[1,8],[3,8],[5,8],[9,8],[11,8],[13,8],
    [1,9],[3,9],[5,9],[6,9],[7,9],[8,9],[9,9],[11,9],[13,9],
    [1,10],[3,10],[11,10],[13,10],[1,11],[3,11],[4,11],[5,11],[6,11],[7,11],[8,11],[9,11],[10,11],[11,11],[13,11],
    [1,12],[13,12],[1,13],[2,13],[3,13],[4,13],[5,13],[6,13],[7,13],[8,13],[9,13],[10,13],[11,13],[12,13],[13,13]
];

function countNodesExplored(grid) {
    var count = 0;
    for (var y = 0; y < grid.height; y++) {
        for (var x = 0; x < grid.width; x++) {
            if (grid.nodes[y][x].closed) count++;
        }
    }
    return count;
}

describe('AStarBenchmark', function() {
    var finder;

    beforeEach(function() {
        finder = new PF.AStarFinder();
    });

    describe('Map 1: Sparse (15x15, (0,0) -> (14,14))', function() {
        it('finds a path', function() {
            var grid = buildGrid(WALLS_SPARSE);
            var path = finder.findPath(0, 0, 14, 14, grid);
            path.should.not.be.empty();
        });

        it('path starts at (0,0)', function() {
            var grid = buildGrid(WALLS_SPARSE);
            var path = finder.findPath(0, 0, 14, 14, grid);
            path[0].should.eql([0, 0]);
        });

        it('path ends at (14,14)', function() {
            var grid = buildGrid(WALLS_SPARSE);
            var path = finder.findPath(0, 0, 14, 14, grid);
            path[path.length - 1].should.eql([14, 14]);
        });

        it('explores at least 1 node', function() {
            var grid = buildGrid(WALLS_SPARSE);
            finder.findPath(0, 0, 14, 14, grid);
            countNodesExplored(grid).should.be.above(0);
        });

        it('path length within grid bounds (<=225)', function() {
            var grid = buildGrid(WALLS_SPARSE);
            var path = finder.findPath(0, 0, 14, 14, grid);
            path.length.should.be.within(1, 225);
        });
    });

    describe('Map 2: Spiral (15x15, (0,0) -> (7,7))', function() {
        it('finds a path', function() {
            var grid = buildGrid(WALLS_SPIRAL);
            var path = finder.findPath(0, 0, 7, 7, grid);
            path.should.not.be.empty();
        });

        it('path starts at (0,0)', function() {
            var grid = buildGrid(WALLS_SPIRAL);
            var path = finder.findPath(0, 0, 7, 7, grid);
            path[0].should.eql([0, 0]);
        });

        it('path ends at (7,7)', function() {
            var grid = buildGrid(WALLS_SPIRAL);
            var path = finder.findPath(0, 0, 7, 7, grid);
            path[path.length - 1].should.eql([7, 7]);
        });

        it('explores at least 1 node', function() {
            var grid = buildGrid(WALLS_SPIRAL);
            finder.findPath(0, 0, 7, 7, grid);
            countNodesExplored(grid).should.be.above(0);
        });

        it('path length within grid bounds (<=225)', function() {
            var grid = buildGrid(WALLS_SPIRAL);
            var path = finder.findPath(0, 0, 7, 7, grid);
            path.length.should.be.within(1, 225);
        });
    });
});
