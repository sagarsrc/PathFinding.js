var PF = require('..');
require('should');

// Helper: build a fresh grid from a 0/1 matrix
function makeGrid(matrix) {
    var height = matrix.length;
    var width  = matrix[0].length;
    return new PF.Grid(width, height, matrix);
}

// Grids used across tests
var OPEN10 = (function() {
    var m = [];
    for (var r = 0; r < 10; r++) {
        m.push([0,0,0,0,0,0,0,0,0,0]);
    }
    return m;
})();

// Grid with start (0,0) fully enclosed by walls
var ENCLOSED_START = [
    [0,1,0,0,0],
    [1,1,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];

// ─────────────────────────────────────────────
//  TC-01: Open grid, A* Manhattan, no diagonal
// ─────────────────────────────────────────────
describe('TC-01: A* Manhattan, no diagonal', function() {
    it('should find axis-aligned path on open grid', function() {
        var finder = new PF.AStarFinder({
            diagonalMovement: PF.DiagonalMovement.Never,
            heuristic: PF.Heuristic.manhattan
        });
        var grid = makeGrid(OPEN10);
        var path = finder.findPath(0, 0, 5, 0, grid);
        path.length.should.be.above(0);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([5, 0]);
        // No diagonal: path length = Manhattan distance + 1
        path.length.should.equal(6);
        // Every step should be cardinal (dx+dy == 1)
        for (var i = 1; i < path.length; i++) {
            var dx = Math.abs(path[i][0] - path[i-1][0]);
            var dy = Math.abs(path[i][1] - path[i-1][1]);
            (dx + dy).should.equal(1);
        }
    });
});

// ─────────────────────────────────────────────
//  TC-02: Open grid, A* Euclidean, diagonal
// ─────────────────────────────────────────────
describe('TC-02: A* Euclidean, diagonal allowed', function() {
    it('should use diagonal shortcuts', function() {
        var finder = new PF.AStarFinder({
            diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle,
            heuristic: PF.Heuristic.euclidean
        });
        var grid = makeGrid(OPEN10);
        var path = finder.findPath(0, 0, 5, 5, grid);
        path.length.should.be.above(0);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([5, 5]);
        // With diagonal: path shorter than Manhattan would require
        // Manhattan distance = 10 + 1 = 11 steps, diagonal should be 6
        path.length.should.be.below(11);
        // At least one diagonal step
        var hasDiagonal = false;
        for (var i = 1; i < path.length; i++) {
            var dx = Math.abs(path[i][0] - path[i-1][0]);
            var dy = Math.abs(path[i][1] - path[i-1][1]);
            if (dx === 1 && dy === 1) hasDiagonal = true;
        }
        hasDiagonal.should.be.true;
    });
});

// ─────────────────────────────────────────────
//  TC-03: Start == End
// ─────────────────────────────────────────────
describe('TC-03: Start == End position', function() {
    it('should return path of length 1', function() {
        var finder = new PF.AStarFinder();
        var grid = makeGrid(OPEN10);
        var path = finder.findPath(3, 3, 3, 3, grid);
        path.length.should.equal(1);
        path[0].should.eql([3, 3]);
    });

    it('should have pathLength 0', function() {
        var finder = new PF.AStarFinder();
        var grid = makeGrid(OPEN10);
        var path = finder.findPath(3, 3, 3, 3, grid);
        PF.Util.pathLength(path).should.equal(0);
    });
});

// ─────────────────────────────────────────────
//  TC-04: Fully enclosed start — no path
// ─────────────────────────────────────────────
describe('TC-04: Fully enclosed start, no path possible', function() {
    it('A* returns empty path', function() {
        var finder = new PF.AStarFinder();
        var grid = makeGrid(ENCLOSED_START);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.should.eql([]);
    });

    it('path length is 0 for empty path', function() {
        var path = [];
        PF.Util.pathLength(path).should.equal(0);
    });

    it('BreadthFirst returns empty path', function() {
        var finder = new PF.BreadthFirstFinder();
        var grid = makeGrid(ENCLOSED_START);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.should.eql([]);
    });

    it('Dijkstra returns empty path', function() {
        var finder = new PF.DijkstraFinder();
        var grid = makeGrid(ENCLOSED_START);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.should.eql([]);
    });
});

// ─────────────────────────────────────────────
//  TC-05: BiAStar vs AStar comparison
// ─────────────────────────────────────────────
describe('TC-05: BiAStar vs AStar', function() {
    it('both find valid path to same endpoint', function() {
        var astar = new PF.AStarFinder();
        var biastar = new PF.BiAStarFinder();
        var grid1 = makeGrid(OPEN10);
        var grid2 = makeGrid(OPEN10);
        var path1 = astar.findPath(0, 0, 9, 9, grid1);
        var path2 = biastar.findPath(0, 0, 9, 9, grid2);
        path1[0].should.eql([0, 0]);
        path1[path1.length - 1].should.eql([9, 9]);
        path2[0].should.eql([0, 0]);
        path2[path2.length - 1].should.eql([9, 9]);
    });
});

// ─────────────────────────────────────────────
//  TC-06: IDA* heuristic selection
//  Verifies BUG-01: each heuristic produces valid result
// ─────────────────────────────────────────────
describe('TC-06: IDA* with different heuristics (BUG-01 verification)', function() {
    var heuristics = ['manhattan', 'euclidean', 'octile', 'chebyshev'];

    heuristics.forEach(function(name) {
        it('should find path with ' + name + ' heuristic', function() {
            var finder = new PF.IDAStarFinder({
                heuristic: PF.Heuristic[name],
                timeLimit: 5
            });
            var grid = makeGrid([
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
            ]);
            var path = finder.findPath(0, 0, 4, 0, grid);
            path.length.should.be.above(0);
            path[0].should.eql([0, 0]);
            path[path.length - 1].should.eql([4, 0]);
        });
    });

    it('BUG-01: panel.js should reference ida_heuristic, not jump_point_heuristic', function() {
        // This test verifies the bug at source level
        var fs = require('fs');
        var panelSrc = fs.readFileSync(
            require('path').join(__dirname, '..', 'visual', 'js', 'panel.js'),
            'utf8'
        );
        // In the ida_header case, heuristic should read from ida_heuristic radio
        var idaCase = panelSrc.split("case 'ida_header':")[1];
        if (idaCase) {
            idaCase = idaCase.split('break;')[0];
            // Should contain ida_heuristic, NOT jump_point_heuristic
            idaCase.should.containEql('ida_heuristic');
            idaCase.should.not.containEql('jump_point_heuristic');
        }
    });
});

// ─────────────────────────────────────────────
//  TC-07: JPS on open grid
// ─────────────────────────────────────────────
describe('TC-07: JPS on open grid', function() {
    it('should find valid path matching A* endpoint', function() {
        var jps = new PF.JumpPointFinder({
            diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle
        });
        var astar = new PF.AStarFinder({
            diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle
        });
        var grid1 = makeGrid(OPEN10);
        var grid2 = makeGrid(OPEN10);
        var jpsPath = jps.findPath(0, 0, 9, 9, grid1);
        var astarPath = astar.findPath(0, 0, 9, 9, grid2);
        jpsPath.length.should.be.above(0);
        jpsPath[0].should.eql([0, 0]);
        jpsPath[jpsPath.length - 1].should.eql([9, 9]);
        // JPS should produce same or shorter path (fewer waypoints due to jumps)
        jpsPath.length.should.be.belowOrEqual(astarPath.length);
    });

    it('orthogonal JPS should find path without diagonal', function() {
        var jps = new PF.JumpPointFinder({
            diagonalMovement: PF.DiagonalMovement.Never
        });
        var grid = makeGrid(OPEN10);
        var path = jps.findPath(0, 0, 5, 5, grid);
        path.length.should.be.above(0);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([5, 5]);
    });
});

// ─────────────────────────────────────────────
//  TC-09: Weight > 1 in A*
// ─────────────────────────────────────────────
describe('TC-09: A* with weight > 1', function() {
    // Use a grid with obstacles to make weight actually matter
    var MAZE = [
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0]
    ];

    it('weighted A* finds a path', function() {
        var finder = new PF.AStarFinder({ weight: 5 });
        var grid = makeGrid(MAZE);
        var path = finder.findPath(0, 0, 9, 9, grid);
        path.length.should.be.above(0);
        path[0].should.eql([0, 0]);
        path[path.length - 1].should.eql([9, 9]);
    });

    it('weighted path may be longer than optimal', function() {
        var optFinder = new PF.AStarFinder({ weight: 1 });
        var wtdFinder = new PF.AStarFinder({ weight: 10 });
        var grid1 = makeGrid(MAZE);
        var grid2 = makeGrid(MAZE);
        var optPath = optFinder.findPath(0, 0, 9, 9, grid1);
        var wtdPath = wtdFinder.findPath(0, 0, 9, 9, grid2);
        var optLen = PF.Util.pathLength(optPath);
        var wtdLen = PF.Util.pathLength(wtdPath);
        // Weighted may produce equal or longer path
        wtdLen.should.be.aboveOrEqual(optLen);
    });
});

// ─────────────────────────────────────────────
//  TC-10: IDA* time limit on large grid
// ─────────────────────────────────────────────
describe('TC-10: IDA* time limit', function() {
    it('should return empty path when time limit is tiny', function() {
        // Use a heuristic that underestimates heavily to force many IDA* depth iterations
        // Zero heuristic = IDA* must explore exponentially many nodes
        var finder = new PF.IDAStarFinder({
            timeLimit: 0.0001,
            heuristic: function() { return 0; },
            diagonalMovement: PF.DiagonalMovement.Never
        });
        var large = [];
        for (var r = 0; r < 50; r++) {
            var row = [];
            for (var c = 0; c < 50; c++) row.push(0);
            large.push(row);
        }
        var grid = makeGrid(large);
        var path = finder.findPath(0, 0, 49, 49, grid);
        path.should.eql([]);
    });

    it('should find path when given sufficient time', function() {
        var finder = new PF.IDAStarFinder({ timeLimit: 10 });
        var grid = makeGrid([
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ]);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.length.should.be.above(0);
    });
});

// ─────────────────────────────────────────────
//  BUG-03: No "no path found" feedback
// ─────────────────────────────────────────────
describe('BUG-03: No path found feedback', function() {
    it('path length should be 0 when no path exists', function() {
        var finder = new PF.AStarFinder();
        var grid = makeGrid(ENCLOSED_START);
        var path = finder.findPath(0, 0, 4, 4, grid);
        path.should.eql([]);
        PF.Util.pathLength(path).should.equal(0);
    });

    it('view.drawPath returns early on empty path (documented gap)', function() {
        // This test documents the behavior: drawPath silently returns
        // when path.length === 0, with no user-facing "no path" message.
        // The fix should add a "no path found" indicator.
        var path = [];
        path.length.should.equal(0);
        // Verify the visual code pattern: drawPath checks !path.length
        var fs = require('fs');
        var viewSrc = fs.readFileSync(
            require('path').join(__dirname, '..', 'visual', 'js', 'view.js'),
            'utf8'
        );
        // After fix, view.js should show "no path found" message
        viewSrc.should.containEql('no path');
    });
});

// ─────────────────────────────────────────────
//  BUG-05: #hide_instruction typo check
// ─────────────────────────────────────────────
describe('BUG-05: hide_instructions ID consistency', function() {
    it('HTML and JS should use same ID for hide button', function() {
        var fs = require('fs');
        var path = require('path');
        var htmlSrc = fs.readFileSync(
            path.join(__dirname, '..', 'visual', 'index.html'), 'utf8'
        );
        var panelSrc = fs.readFileSync(
            path.join(__dirname, '..', 'visual', 'js', 'panel.js'), 'utf8'
        );
        // HTML uses id="hide_instructions"
        htmlSrc.should.containEql('id="hide_instructions"');
        // JS should reference same ID
        panelSrc.should.containEql("'#hide_instructions'");
    });
});

// ─────────────────────────────────────────────
//  BUG-07: Stale bundle verification
// ─────────────────────────────────────────────
describe('BUG-07: Bundle staleness check', function() {
    it('bundle file should exist', function() {
        var fs = require('fs');
        var bundlePath = require('path').join(
            __dirname, '..', 'visual', 'lib', 'pathfinding-browser.min.js'
        );
        fs.existsSync(bundlePath).should.be.true;
    });
});
