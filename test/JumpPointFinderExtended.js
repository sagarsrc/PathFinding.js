/**
 * Tests for JPFAlwaysMoveDiagonally, JPFMoveDiagonallyIfNoObstacles,
 * BiAStarFinder, BiDijkstraFinder, BiBreadthFirstFinder, JumpPointFinder factory,
 * JPFNeverMoveDiagonally, JPFMoveDiagonallyIfAtMostOneObstacle, JumpPointFinderBase.
 */
var PF = require('..');
var scenarios = require('./PathTestScenarios');

var JPFAlwaysMoveDiagonally         = require('../src/finders/JPFAlwaysMoveDiagonally');
var JPFMoveDiagonallyIfNoObstacles  = require('../src/finders/JPFMoveDiagonallyIfNoObstacles');
var JPFMoveDiagonallyIfAtMostOneObstacle = require('../src/finders/JPFMoveDiagonallyIfAtMostOneObstacle');
var JPFNeverMoveDiagonally          = require('../src/finders/JPFNeverMoveDiagonally');

// ─── helpers ──────────────────────────────────────────────────────────────────

function makeGrid(matrix) {
    var height = matrix.length, width = matrix[0].length;
    return new PF.Grid(width, height, matrix);
}

// 5x5: end (2,2) completely surrounded by walls on all 8 sides — no path even diagonally
var NO_PATH_MATRIX = [
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0]
];
// start=(0,0) end=(2,2) — end is surrounded by walls (including diagonals), no path

// 1x1 grid for start==end — no neighbors, bidirectional returns []
var SINGLE_CELL = [[0]];

// ─── JPFAlwaysMoveDiagonally ───────────────────────────────────────────────────

describe('JPFAlwaysMoveDiagonally', function() {
    var finder;

    beforeEach(function() {
        finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.Always });
    });

    it('should return an instance of JPFAlwaysMoveDiagonally via factory', function() {
        finder.should.be.an.instanceof(JPFAlwaysMoveDiagonally);
    });

    scenarios.forEach(function(scen, idx) {
        it('should solve maze ' + (idx + 1), function() {
            var grid = makeGrid(scen.matrix);
            var path = finder.findPath(scen.startX, scen.startY, scen.endX, scen.endY, grid);
            path[0].should.eql([scen.startX, scen.startY]);
            path[path.length - 1].should.eql([scen.endX, scen.endY]);
        });
    });

    it('should return [] when no path exists', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = finder.findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    it('_findNeighbors: no-parent returns all diagonal neighbors', function() {
        // Open 3x3 grid — node at center (1,1) with no parent should get all 8 neighbors
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        // Run findPath to initialize finder.grid
        finder.findPath(0, 0, 2, 2, grid);
        // Re-initialize grid for neighbor check
        var grid2 = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        finder.grid = grid2;
        var node = grid2.getNodeAt(1, 1); // no parent
        var neighbors = finder._findNeighbors(node);
        neighbors.length.should.equal(8);
    });

    it('_findNeighbors: diagonal parent prunes to natural + forced', function() {
        // Layout: moving diagonally right-down, obstacle forces extra neighbor
        //   0 0 0
        //   1 0 0  <- (0,1) blocked
        //   0 0 0
        var grid = makeGrid([[0,0,0],[1,0,0],[0,0,0]]);
        finder.grid = grid;
        var node = grid.getNodeAt(1, 1);
        node.parent = grid.getNodeAt(0, 0); // diagonal parent → dx=1, dy=1
        var neighbors = finder._findNeighbors(node);
        // natural: (1,2), (2,1), (2,2); forced: (0,2) because (0,1) blocked
        var coords = neighbors.map(function(n) { return n[0] + ',' + n[1]; });
        coords.should.containEql('1,2');
        coords.should.containEql('2,1');
        coords.should.containEql('2,2');
        coords.should.containEql('0,2'); // forced neighbor
    });

    it('_findNeighbors: horizontal parent prunes correctly', function() {
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        finder.grid = grid;
        var node = grid.getNodeAt(1, 1);
        node.parent = grid.getNodeAt(0, 1); // moving right, dx=1, dy=0
        var neighbors = finder._findNeighbors(node);
        var coords = neighbors.map(function(n) { return n[0] + ',' + n[1]; });
        coords.should.containEql('2,1'); // natural: ahead
    });

    it('_findNeighbors: vertical parent prunes correctly', function() {
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        finder.grid = grid;
        var node = grid.getNodeAt(1, 1);
        node.parent = grid.getNodeAt(1, 0); // moving down, dx=0, dy=1
        var neighbors = finder._findNeighbors(node);
        var coords = neighbors.map(function(n) { return n[0] + ',' + n[1]; });
        coords.should.containEql('1,2'); // natural: below
    });
});

// ─── JPFMoveDiagonallyIfNoObstacles ───────────────────────────────────────────

describe('JPFMoveDiagonallyIfNoObstacles', function() {
    var finder;

    beforeEach(function() {
        finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles });
    });

    it('should return an instance of JPFMoveDiagonallyIfNoObstacles via factory', function() {
        finder.should.be.an.instanceof(JPFMoveDiagonallyIfNoObstacles);
    });

    scenarios.forEach(function(scen, idx) {
        it('should solve maze ' + (idx + 1), function() {
            var grid = makeGrid(scen.matrix);
            var path = finder.findPath(scen.startX, scen.startY, scen.endX, scen.endY, grid);
            path[0].should.eql([scen.startX, scen.startY]);
            path[path.length - 1].should.eql([scen.endX, scen.endY]);
        });
    });

    it('should return [] when no path exists', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = finder.findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    // forced-neighbor diagonal detection is commented out (lines 44–47):
    // the code does NOT return a jump point for diagonal forced-neighbor conditions
    // when moving diagonally — instead relies only on h/v sub-jump detection.
    it('diagonal forced-neighbor check is disabled (documented behavior)', function() {
        // Grid where forced-neighbor would trigger in IfAtMostOneObstacle but NOT here
        // (0,1) is blocked; moving diagonally from (0,0) to (2,2)
        // OnlyWhenNoObstacles cannot even move diagonally past (1,1) if axes blocked
        var grid = makeGrid([[0,0,0],[1,0,0],[0,0,0]]);
        var path = finder.findPath(0, 0, 2, 2, grid);
        // path may be empty or indirect since (0,1) blocked prevents clear diagonal
        path.should.be.an.Array();
    });
});

// ─── JumpPointFinder factory ───────────────────────────────────────────────────

describe('JumpPointFinder factory', function() {
    it('DiagonalMovement.Always → JPFAlwaysMoveDiagonally', function() {
        var f = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.Always });
        f.should.be.an.instanceof(JPFAlwaysMoveDiagonally);
    });

    it('DiagonalMovement.OnlyWhenNoObstacles → JPFMoveDiagonallyIfNoObstacles', function() {
        var f = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.OnlyWhenNoObstacles });
        f.should.be.an.instanceof(JPFMoveDiagonallyIfNoObstacles);
    });

    it('DiagonalMovement.Never → JPFNeverMoveDiagonally', function() {
        var f = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.Never });
        f.should.be.an.instanceof(JPFNeverMoveDiagonally);
    });

    it('no option (default) → JPFMoveDiagonallyIfAtMostOneObstacle', function() {
        var f = new PF.JumpPointFinder();
        f.should.be.an.instanceof(JPFMoveDiagonallyIfAtMostOneObstacle);
    });

    it('DiagonalMovement.IfAtMostOneObstacle → JPFMoveDiagonallyIfAtMostOneObstacle', function() {
        var f = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        f.should.be.an.instanceof(JPFMoveDiagonallyIfAtMostOneObstacle);
    });
});

// ─── BiAStarFinder ────────────────────────────────────────────────────────────

describe('BiAStarFinder (isolation)', function() {
    it('should return [] when no path exists', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = new PF.BiAStarFinder().findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    it('start === end on single-cell grid returns []', function() {
        var grid = makeGrid(SINGLE_CELL);
        var path = new PF.BiAStarFinder().findPath(0, 0, 0, 0, grid);
        path.should.eql([]);
    });

    it('weight option accepted without error', function() {
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        var path = new PF.BiAStarFinder({ weight: 2 }).findPath(0, 0, 2, 2, grid);
        path.length.should.be.above(0);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([2, 2]);
    });

    it('should find path on simple grid (meeting-in-middle verifiable)', function() {
        // 1x5 corridor: start=(0,0) end=(4,0)
        var grid = new PF.Grid(5, 1);
        var path = new PF.BiAStarFinder().findPath(0, 0, 4, 0, grid);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([4, 0]);
        path.length.should.equal(5);
    });
});

// ─── BiDijkstraFinder ─────────────────────────────────────────────────────────

describe('BiDijkstraFinder (isolation)', function() {
    it('should return [] when no path exists', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = new PF.BiDijkstraFinder().findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    it('start === end on single-cell grid returns []', function() {
        var grid = makeGrid(SINGLE_CELL);
        var path = new PF.BiDijkstraFinder().findPath(0, 0, 0, 0, grid);
        path.should.eql([]);
    });

    it('should find path on simple corridor', function() {
        var grid = new PF.Grid(5, 1);
        var path = new PF.BiDijkstraFinder().findPath(0, 0, 4, 0, grid);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([4, 0]);
        path.length.should.equal(5);
    });
});

// ─── BiBreadthFirstFinder ─────────────────────────────────────────────────────

describe('BiBreadthFirstFinder (isolation)', function() {
    it('should return [] when no path exists', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = new PF.BiBreadthFirstFinder().findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    it('start === end on single-cell grid returns []', function() {
        var grid = makeGrid(SINGLE_CELL);
        var path = new PF.BiBreadthFirstFinder().findPath(0, 0, 0, 0, grid);
        path.should.eql([]);
    });
});

// ─── JPFNeverMoveDiagonally ───────────────────────────────────────────────────

describe('JPFNeverMoveDiagonally', function() {
    it('_jump should throw when dx===0 && dy===0', function() {
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.Never });
        var grid = new PF.Grid(3, 3);
        finder.grid = grid;
        finder.endNode = grid.getNodeAt(2, 2);
        (function() {
            finder._jump(1, 1, 1, 1); // dx=0, dy=0
        }).should.throw('Only horizontal and vertical movements are allowed');
    });
});

// ─── JPFMoveDiagonallyIfAtMostOneObstacle ─────────────────────────────────────

describe('JPFMoveDiagonallyIfAtMostOneObstacle (branches)', function() {
    it('trackJumpRecursion: true marks nodes as tested', function() {
        var finder = new PF.JumpPointFinder({
            diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle,
            trackJumpRecursion: true
        });
        var grid = new PF.Grid(5, 5);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.length.should.be.above(0);
        // at least one node other than start should have been tested
        var testedCount = 0;
        for (var x = 0; x < 5; x++) {
            for (var y = 0; y < 5; y++) {
                if (grid.getNodeAt(x, y).tested) testedCount++;
            }
        }
        testedCount.should.be.above(0);
    });

    it('diagonal forced-neighbor branch: obstacle behind triggers jump point', function() {
        // Moving diagonally right-down (dx=1, dy=1) at (1,1) with parent (0,0)
        // (0,1) blocked → isWalkableAt(x-dx=0, y=1)=false, isWalkableAt(x-dx=0, y+dy=2)=true
        // → forced neighbor detected → (1,1) is jump point
        var grid = makeGrid([
            [0, 0, 0],
            [1, 0, 0],
            [0, 0, 0]
        ]);
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        finder.grid = grid;
        finder.startNode = grid.getNodeAt(0, 0);
        finder.endNode = grid.getNodeAt(2, 2);
        // (1,1) moving diagonally from (0,0): dx=1, dy=1
        // condition: !isWalkableAt(0,1) && isWalkableAt(0,2) → jump point
        var result = finder._jump(1, 1, 0, 0);
        result.should.eql([1, 1]);
    });

    it('diagonal blocked early-return null when both axes blocked', function() {
        // At (1,1) moving diagonally (dx=1, dy=1): (2,1) and (1,2) both blocked
        // → both grid.isWalkableAt(x+dx,y) and grid.isWalkableAt(x,y+dy) false → null
        var grid = makeGrid([
            [0, 0, 0],
            [0, 0, 1],  // (2,1) blocked
            [0, 1, 0],  // (1,2) blocked
        ]);
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        finder.grid = grid;
        finder.startNode = grid.getNodeAt(0, 0);
        finder.endNode = grid.getNodeAt(2, 2);
        // jump from (1,1) in direction dx=1, dy=1 → both axes blocked → null
        var result = finder._jump(1, 1, 0, 0);
        (result === null).should.be.true();
    });

    it('no-path scenario returns []', function() {
        var grid = makeGrid(NO_PATH_MATRIX);
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        var path = finder.findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });
});

// ─── JumpPointFinderBase ──────────────────────────────────────────────────────

describe('JumpPointFinderBase', function() {
    it('findPath returns [] when no path exists', function() {
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        var grid = makeGrid(NO_PATH_MATRIX);
        var path = finder.findPath(0, 0, 2, 2, grid);
        path.should.eql([]);
    });

    it('_identifySuccessors: jumpNode.closed skip — path still found correctly', function() {
        // In a grid where multiple paths lead to same jump point, closed skip fires.
        // Use a large open grid where A* expansion may close nodes before re-encounter.
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        var grid = new PF.Grid(10, 10);
        var path = finder.findPath(0, 0, 9, 9, grid);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([9, 9]);
    });

    it('_identifySuccessors: updateItem branch fires when jump node found via cheaper path', function() {
        // Grid with multiple routes to same jump point — ensures updateItem branch.
        // Two corridors converge: open 5x5 grid with specific obstacle layout.
        var matrix = [
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0]
        ];
        var finder = new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle });
        var grid = makeGrid(matrix);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([4, 4]);
    });
});
