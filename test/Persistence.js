var PF = require('..');
var ScenarioPersistence = require('../src/core/ScenarioPersistence');
require('should');

var SIZE = 15;

// ─────────────────────────────────────────────
//  saveScenario
// ─────────────────────────────────────────────
describe('ScenarioPersistence.saveScenario', function() {
    it('returns a JSON string', function() {
        var grid = new PF.Grid(5, 5);
        var json = ScenarioPersistence.saveScenario(grid, 0, 0, 4, 4);
        json.should.be.a.String();
        (function() { JSON.parse(json); }).should.not.throw();
    });

    it('serialises grid dimensions', function() {
        var grid = new PF.Grid(5, 7);
        var data = JSON.parse(ScenarioPersistence.saveScenario(grid, 0, 0, 4, 6));
        data.width.should.equal(5);
        data.height.should.equal(7);
    });

    it('serialises start and end', function() {
        var grid = new PF.Grid(5, 5);
        var data = JSON.parse(ScenarioPersistence.saveScenario(grid, 1, 2, 3, 4));
        data.start.should.eql([1, 2]);
        data.end.should.eql([3, 4]);
    });

    it('serialises wall positions as 0/1 matrix', function() {
        var grid = new PF.Grid(3, 3);
        grid.setWalkableAt(1, 1, false);
        var data = JSON.parse(ScenarioPersistence.saveScenario(grid, 0, 0, 2, 2));
        data.matrix.should.be.an.Array();
        data.matrix.length.should.equal(3);
        data.matrix[0].length.should.equal(3);
        data.matrix[1][1].should.equal(1);  // wall
        data.matrix[0][0].should.equal(0);  // walkable
    });

    it('matrix rows have correct length', function() {
        var grid = new PF.Grid(4, 3);
        var data = JSON.parse(ScenarioPersistence.saveScenario(grid, 0, 0, 3, 2));
        data.matrix.forEach(function(row) {
            row.length.should.equal(4);
        });
    });
});

// ─────────────────────────────────────────────
//  loadScenario
// ─────────────────────────────────────────────
describe('ScenarioPersistence.loadScenario', function() {
    function roundtrip(w, h, sx, sy, ex, ey, walls) {
        var grid = new PF.Grid(w, h);
        (walls || []).forEach(function(pos) { grid.setWalkableAt(pos[0], pos[1], false); });
        var json = ScenarioPersistence.saveScenario(grid, sx, sy, ex, ey);
        return ScenarioPersistence.loadScenario(json);
    }

    it('returns object with grid, start, end', function() {
        var result = roundtrip(5, 5, 0, 0, 4, 4);
        result.should.have.property('grid');
        result.should.have.property('start');
        result.should.have.property('end');
    });

    it('restores grid dimensions', function() {
        var result = roundtrip(6, 8, 0, 0, 5, 7);
        result.grid.width.should.equal(6);
        result.grid.height.should.equal(8);
    });

    it('restores start and end', function() {
        var result = roundtrip(5, 5, 1, 2, 3, 4);
        result.start.should.eql([1, 2]);
        result.end.should.eql([3, 4]);
    });

    it('restores wall walkability', function() {
        var result = roundtrip(3, 3, 0, 0, 2, 2, [[1, 1]]);
        result.grid.isWalkableAt(1, 1).should.be.false();
        result.grid.isWalkableAt(0, 0).should.be.true();
    });

    it('loaded grid is a PF.Grid instance', function() {
        var result = roundtrip(5, 5, 0, 0, 4, 4);
        result.grid.should.be.an.instanceOf(PF.Grid);
    });

    it('throws on invalid JSON', function() {
        (function() { ScenarioPersistence.loadScenario('not json'); }).should.throw();
    });

    it('throws when matrix missing', function() {
        var bad = JSON.stringify({ width: 3, height: 3, start: [0,0], end: [2,2] });
        (function() { ScenarioPersistence.loadScenario(bad); }).should.throw();
    });
});

// ─────────────────────────────────────────────
//  getPreset
// ─────────────────────────────────────────────
describe('ScenarioPersistence.getPreset', function() {
    var PRESETS = ['empty', 'maze', 'spiral', 'bottleneck', 'random'];

    PRESETS.forEach(function(name) {
        it('preset "' + name + '" has 15x15 grid', function() {
            var result = ScenarioPersistence.getPreset(name);
            result.grid.width.should.equal(SIZE);
            result.grid.height.should.equal(SIZE);
        });

        it('preset "' + name + '" has valid start and end arrays', function() {
            var result = ScenarioPersistence.getPreset(name);
            result.start.should.be.an.Array().and.have.length(2);
            result.end.should.be.an.Array().and.have.length(2);
        });

        it('preset "' + name + '" start and end are walkable', function() {
            var result = ScenarioPersistence.getPreset(name);
            var g = result.grid;
            g.isWalkableAt(result.start[0], result.start[1]).should.be.true();
            g.isWalkableAt(result.end[0], result.end[1]).should.be.true();
        });

        it('preset "' + name + '" start and end are inside grid', function() {
            var result = ScenarioPersistence.getPreset(name);
            var g = result.grid;
            g.isInside(result.start[0], result.start[1]).should.be.true();
            g.isInside(result.end[0], result.end[1]).should.be.true();
        });
    });

    it('preset "empty" has no walls', function() {
        var result = ScenarioPersistence.getPreset('empty');
        var g = result.grid;
        for (var y = 0; y < SIZE; y++) {
            for (var x = 0; x < SIZE; x++) {
                g.isWalkableAt(x, y).should.be.true();
            }
        }
    });

    it('preset "maze" has walls', function() {
        var result = ScenarioPersistence.getPreset('maze');
        var g = result.grid;
        var wallCount = 0;
        for (var y = 0; y < SIZE; y++) {
            for (var x = 0; x < SIZE; x++) {
                if (!g.isWalkableAt(x, y)) wallCount++;
            }
        }
        wallCount.should.be.above(20);
    });

    it('preset "bottleneck" has narrow passage (few walkable cells in middle row)', function() {
        var result = ScenarioPersistence.getPreset('bottleneck');
        var g = result.grid;
        var midRow = Math.floor(SIZE / 2);
        var walkableInMid = 0;
        for (var x = 0; x < SIZE; x++) {
            if (g.isWalkableAt(x, midRow)) walkableInMid++;
        }
        // bottleneck: only 1-3 passages in middle row
        walkableInMid.should.be.below(4);
    });

    it('throws on unknown preset name', function() {
        (function() { ScenarioPersistence.getPreset('nonexistent'); }).should.throw();
    });

    it('listPresets returns array of available preset names', function() {
        var names = ScenarioPersistence.listPresets();
        names.should.be.an.Array();
        PRESETS.forEach(function(name) {
            names.should.containEql(name);
        });
    });
});
