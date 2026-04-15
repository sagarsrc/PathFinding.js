/**
 * TDD tests for ScenarioControls module.
 * Tests cover pure-logic pieces: algorithm list, presets, grid
 * serialization/deserialization, grid-size validation, speed config.
 */
var PF = require('..');
var ScenarioControls = require('../visual/js/scenario-controls');
require('should');

// ─────────────────────────────────────────────
//  Algorithm list
// ─────────────────────────────────────────────
describe('ScenarioControls.ALGORITHMS', function() {
    it('should be a non-empty array', function() {
        ScenarioControls.ALGORITHMS.should.be.an.Array();
        ScenarioControls.ALGORITHMS.length.should.be.above(0);
    });

    it('should include AStarFinder', function() {
        var ids = ScenarioControls.ALGORITHMS.map(function(a) { return a.id; });
        ids.should.containEql('AStarFinder');
    });

    it('should include BreadthFirstFinder', function() {
        var ids = ScenarioControls.ALGORITHMS.map(function(a) { return a.id; });
        ids.should.containEql('BreadthFirstFinder');
    });

    it('should include DijkstraFinder', function() {
        var ids = ScenarioControls.ALGORITHMS.map(function(a) { return a.id; });
        ids.should.containEql('DijkstraFinder');
    });

    it('should include JumpPointFinder', function() {
        var ids = ScenarioControls.ALGORITHMS.map(function(a) { return a.id; });
        ids.should.containEql('JumpPointFinder');
    });

    it('each entry should have id and label fields', function() {
        ScenarioControls.ALGORITHMS.forEach(function(algo) {
            algo.should.have.property('id');
            algo.should.have.property('label');
            algo.id.should.be.a.String();
            algo.label.should.be.a.String();
        });
    });
});

// ─────────────────────────────────────────────
//  Speed config
// ─────────────────────────────────────────────
describe('ScenarioControls.SPEED_CONFIG', function() {
    it('should have min, max, default fields', function() {
        ScenarioControls.SPEED_CONFIG.should.have.properties(['min', 'max', 'default']);
    });

    it('min < default < max', function() {
        var s = ScenarioControls.SPEED_CONFIG;
        s.min.should.be.below(s.default);
        s.default.should.be.below(s.max);
    });

    it('all values should be positive numbers', function() {
        var s = ScenarioControls.SPEED_CONFIG;
        s.min.should.be.above(0);
        s.max.should.be.above(0);
        s.default.should.be.above(0);
    });
});

// ─────────────────────────────────────────────
//  Grid size defaults
// ─────────────────────────────────────────────
describe('ScenarioControls.GRID_SIZE_DEFAULT', function() {
    it('should be 15x15', function() {
        ScenarioControls.GRID_SIZE_DEFAULT.should.eql({ width: 15, height: 15 });
    });
});

// ─────────────────────────────────────────────
//  validateGridSize
// ─────────────────────────────────────────────
describe('ScenarioControls.validateGridSize', function() {
    it('should accept 15x15', function() {
        ScenarioControls.validateGridSize(15, 15).should.be.true();
    });

    it('should accept minimum 5x5', function() {
        ScenarioControls.validateGridSize(5, 5).should.be.true();
    });

    it('should accept maximum 50x50', function() {
        ScenarioControls.validateGridSize(50, 50).should.be.true();
    });

    it('should reject 4x4 (too small)', function() {
        ScenarioControls.validateGridSize(4, 4).should.be.false();
    });

    it('should reject 51x51 (too large)', function() {
        ScenarioControls.validateGridSize(51, 51).should.be.false();
    });

    it('should reject non-integer', function() {
        ScenarioControls.validateGridSize(10.5, 10).should.be.false();
    });

    it('should reject zero', function() {
        ScenarioControls.validateGridSize(0, 10).should.be.false();
    });

    it('should reject negative', function() {
        ScenarioControls.validateGridSize(-1, 10).should.be.false();
    });
});

// ─────────────────────────────────────────────
//  serializeGrid
// ─────────────────────────────────────────────
describe('ScenarioControls.serializeGrid', function() {
    function makeGrid(matrix) {
        return new PF.Grid(matrix[0].length, matrix.length, matrix);
    }

    it('should return an object with version field', function() {
        var grid = makeGrid([[0,0],[0,0]]);
        var result = ScenarioControls.serializeGrid(grid, 0, 0, 1, 1);
        result.should.have.property('version', '1');
    });

    it('should include width and height', function() {
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        var result = ScenarioControls.serializeGrid(grid, 0, 0, 2, 2);
        result.width.should.equal(3);
        result.height.should.equal(3);
    });

    it('should store start and end positions', function() {
        var grid = makeGrid([[0,0,0],[0,0,0],[0,0,0]]);
        var result = ScenarioControls.serializeGrid(grid, 1, 0, 2, 2);
        result.startX.should.equal(1);
        result.startY.should.equal(0);
        result.endX.should.equal(2);
        result.endY.should.equal(2);
    });

    it('should serialize walls as array of [x,y] pairs', function() {
        var matrix = [
            [0,1,0],
            [0,0,0],
            [0,0,0]
        ];
        var grid = makeGrid(matrix);
        var result = ScenarioControls.serializeGrid(grid, 0, 0, 2, 2);
        result.walls.should.be.an.Array();
        result.walls.should.containDeep([[1, 0]]);
    });

    it('should have empty walls array for open grid', function() {
        var grid = makeGrid([[0,0],[0,0]]);
        var result = ScenarioControls.serializeGrid(grid, 0, 0, 1, 1);
        result.walls.should.eql([]);
    });

    it('should include all wall positions', function() {
        var matrix = [
            [0,1,1],
            [0,0,1],
            [0,0,0]
        ];
        var grid = makeGrid(matrix);
        var result = ScenarioControls.serializeGrid(grid, 0, 0, 2, 2);
        result.walls.length.should.equal(3);
    });
});

// ─────────────────────────────────────────────
//  deserializeGrid
// ─────────────────────────────────────────────
describe('ScenarioControls.deserializeGrid', function() {
    var SIMPLE_SCENARIO = {
        version: '1',
        width: 3,
        height: 3,
        startX: 0,
        startY: 0,
        endX: 2,
        endY: 2,
        walls: [[1, 0]]
    };

    it('should return object with grid, startX, startY, endX, endY', function() {
        var result = ScenarioControls.deserializeGrid(SIMPLE_SCENARIO);
        result.should.have.properties(['grid', 'startX', 'startY', 'endX', 'endY']);
    });

    it('should restore grid dimensions', function() {
        var result = ScenarioControls.deserializeGrid(SIMPLE_SCENARIO);
        result.grid.width.should.equal(3);
        result.grid.height.should.equal(3);
    });

    it('should restore start and end positions', function() {
        var result = ScenarioControls.deserializeGrid(SIMPLE_SCENARIO);
        result.startX.should.equal(0);
        result.startY.should.equal(0);
        result.endX.should.equal(2);
        result.endY.should.equal(2);
    });

    it('should restore wall as non-walkable', function() {
        var result = ScenarioControls.deserializeGrid(SIMPLE_SCENARIO);
        result.grid.isWalkableAt(1, 0).should.be.false();
    });

    it('should restore open cells as walkable', function() {
        var result = ScenarioControls.deserializeGrid(SIMPLE_SCENARIO);
        result.grid.isWalkableAt(0, 0).should.be.true();
    });

    it('should accept JSON string input', function() {
        var json = JSON.stringify(SIMPLE_SCENARIO);
        var result = ScenarioControls.deserializeGrid(json);
        result.grid.width.should.equal(3);
    });

    it('should throw on missing version', function() {
        var bad = { width: 3, height: 3, startX: 0, startY: 0, endX: 2, endY: 2, walls: [] };
        (function() { ScenarioControls.deserializeGrid(bad); }).should.throw();
    });

    it('should throw on invalid dimensions', function() {
        var bad = { version: '1', width: 0, height: 3, startX: 0, startY: 0, endX: 2, endY: 2, walls: [] };
        (function() { ScenarioControls.deserializeGrid(bad); }).should.throw();
    });

    it('round-trip: serialize then deserialize preserves walls', function() {
        var PF = require('..');
        var matrix = [
            [0,0,0,0,0],
            [0,1,1,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ];
        var original = new PF.Grid(5, 5, matrix);
        var serialized = ScenarioControls.serializeGrid(original, 0, 0, 4, 4);
        var restored = ScenarioControls.deserializeGrid(serialized);
        restored.grid.isWalkableAt(1, 1).should.be.false();
        restored.grid.isWalkableAt(2, 1).should.be.false();
        restored.grid.isWalkableAt(0, 0).should.be.true();
        restored.grid.isWalkableAt(4, 4).should.be.true();
    });
});

// ─────────────────────────────────────────────
//  Presets
// ─────────────────────────────────────────────
describe('ScenarioControls.PRESETS', function() {
    it('should be a non-empty array', function() {
        ScenarioControls.PRESETS.should.be.an.Array();
        ScenarioControls.PRESETS.length.should.be.above(0);
    });

    it('each preset should have id, label, scenario fields', function() {
        ScenarioControls.PRESETS.forEach(function(preset) {
            preset.should.have.properties(['id', 'label', 'scenario']);
            preset.scenario.should.have.properties(['version', 'width', 'height', 'startX', 'startY', 'endX', 'endY', 'walls']);
        });
    });

    it('each preset scenario should be deserializable', function() {
        ScenarioControls.PRESETS.forEach(function(preset) {
            var result = ScenarioControls.deserializeGrid(preset.scenario);
            result.grid.width.should.equal(preset.scenario.width);
        });
    });

    it('should include an "empty" preset', function() {
        var ids = ScenarioControls.PRESETS.map(function(p) { return p.id; });
        ids.should.containEql('empty');
    });
});
