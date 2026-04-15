var should = require('should');
var PF = require('..');

// Map definitions (shared with benchmark)
var MAPS = require('../docs/experiments/001-demo-artifacts/fleets/fleet-03-algorithm-race/workers/racer-dijkstra/maps');

function buildGrid(mapDef) {
    var matrix = [];
    for (var r = 0; r < mapDef.rows; r++) {
        matrix.push(new Array(mapDef.cols).fill(0));
    }
    mapDef.walls.forEach(function(w) {
        matrix[w[1]][w[0]] = 1;
    });
    return new PF.Grid(mapDef.cols, mapDef.rows, matrix);
}

function countExplored(grid) {
    var count = 0;
    for (var x = 0; x < grid.width; x++) {
        for (var y = 0; y < grid.height; y++) {
            if (grid.getNodeAt(x, y).closed) count++;
        }
    }
    return count;
}

describe('DijkstraBenchmark', function() {
    var finder;

    beforeEach(function() {
        finder = new PF.DijkstraFinder();
    });

    describe('Map 1: Sparse', function() {
        var map = MAPS.sparse;

        it('should find a path', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path.should.be.an.Array();
            path.length.should.be.above(0);
        });

        it('path should start at start node', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path[0].should.eql([map.startX, map.startY]);
        });

        it('path should end at end node', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path[path.length - 1].should.eql([map.endX, map.endY]);
        });

        it('should explore nodes', function() {
            var grid = buildGrid(map);
            finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            var explored = countExplored(grid);
            explored.should.be.above(0);
        });
    });

    describe('Map 2: Spiral', function() {
        var map = MAPS.spiral;

        it('should find a path', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path.should.be.an.Array();
            path.length.should.be.above(0);
        });

        it('path should start at start node', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path[0].should.eql([map.startX, map.startY]);
        });

        it('path should end at end node', function() {
            var grid = buildGrid(map);
            var path = finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            path[path.length - 1].should.eql([map.endX, map.endY]);
        });

        it('should explore nodes', function() {
            var grid = buildGrid(map);
            finder.findPath(map.startX, map.startY, map.endX, map.endY, grid);
            var explored = countExplored(grid);
            explored.should.be.above(0);
        });
    });
});
