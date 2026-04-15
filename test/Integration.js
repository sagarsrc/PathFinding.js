var PF = require('..');
var GridCanvas = require('../visual/js/grid-canvas');
var ScenarioPersistence = require('../src/core/ScenarioPersistence');
var Metrics = require('../src/scorer/Metrics');
var RunStore = require('../src/scorer/RunStore');
var ScenarioBuilder = require('../src/core/ScenarioBuilder');
require('should');

// In-memory storage stub
function MemStorage() { this._data = {}; }
MemStorage.prototype.getItem = function(k) { return this._data.hasOwnProperty(k) ? this._data[k] : null; };
MemStorage.prototype.setItem = function(k, v) { this._data[k] = String(v); };
MemStorage.prototype.removeItem = function(k) { delete this._data[k]; };

// ─────────────────────────────────────────────
//  ScenarioBuilder — construction
// ─────────────────────────────────────────────
describe('ScenarioBuilder — construction', function() {
    it('creates with default 15x15 grid', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.cols.should.equal(15);
        sb.canvas.rows.should.equal(15);
    });

    it('creates with custom grid size', function() {
        var sb = new ScenarioBuilder({ cols: 10, rows: 8 });
        sb.canvas.cols.should.equal(10);
        sb.canvas.rows.should.equal(8);
    });

    it('has a RunStore', function() {
        var sb = new ScenarioBuilder();
        sb.runStore.should.be.an.instanceOf(RunStore);
    });

    it('accepts external storage for RunStore', function() {
        var mem = new MemStorage();
        var sb = new ScenarioBuilder({ storage: mem });
        sb.runStore._storage.should.equal(mem);
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — findPath (core integration)
// ─────────────────────────────────────────────
describe('ScenarioBuilder.findPath', function() {
    it('runs A* on current grid and returns result', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 0);
        var result = sb.findPath('AStarFinder');
        result.should.have.property('path');
        result.should.have.property('metrics');
        result.path.length.should.be.above(0);
        result.path[0].should.eql([0, 0]);
        result.path[result.path.length - 1].should.eql([4, 0]);
    });

    it('returns empty path when no route exists', function() {
        var sb = new ScenarioBuilder({ cols: 5, rows: 5 });
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 4);
        // Wall off start completely
        sb.canvas.toggleWall(1, 0);
        sb.canvas.toggleWall(0, 1);
        sb.canvas.toggleWall(1, 1);
        var result = sb.findPath('AStarFinder');
        result.path.should.eql([]);
        result.metrics.pathLength.should.equal(0);
    });

    it('metrics contain algorithm name', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(2, 0);
        var result = sb.findPath('BreadthFirstFinder');
        result.metrics.algorithm.should.equal('BreadthFirstFinder');
    });

    it('metrics contain nodesExplored > 0 for valid path', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(3, 3);
        var result = sb.findPath('AStarFinder');
        result.metrics.nodesExplored.should.be.above(0);
    });

    it('metrics contain timeMs >= 0', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(2, 0);
        var result = sb.findPath('AStarFinder');
        result.metrics.timeMs.should.be.aboveOrEqual(0);
    });

    it('throws when start not set', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setEnd(4, 4);
        (function() { sb.findPath('AStarFinder'); }).should.throw(/start/i);
    });

    it('throws when end not set', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        (function() { sb.findPath('AStarFinder'); }).should.throw(/end/i);
    });

    it('throws for unknown algorithm', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 4);
        (function() { sb.findPath('NonExistentFinder'); }).should.throw();
    });

    it('supports all built-in finders', function() {
        var finders = [
            'AStarFinder', 'BestFirstFinder', 'BreadthFirstFinder',
            'DijkstraFinder', 'BiAStarFinder', 'BiBestFirstFinder',
            'BiBreadthFirstFinder', 'BiDijkstraFinder'
        ];
        finders.forEach(function(name) {
            var sb = new ScenarioBuilder();
            sb.canvas.setStart(0, 0);
            sb.canvas.setEnd(5, 5);
            var result = sb.findPath(name);
            result.path.length.should.be.above(0,
                name + ' should find path on open grid');
        });
    });

    it('supports finder options (weight, heuristic)', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(5, 0);
        var result = sb.findPath('AStarFinder', {
            weight: 5,
            heuristic: PF.Heuristic.manhattan
        });
        result.path.length.should.be.above(0);
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — animation steps
// ─────────────────────────────────────────────
describe('ScenarioBuilder.findPath — animation data', function() {
    it('result contains operations array for step-by-step replay', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(3, 0);
        var result = sb.findPath('AStarFinder');
        result.should.have.property('operations');
        result.operations.should.be.an.Array();
        result.operations.length.should.be.above(0);
    });

    it('each operation has x, y, attr fields', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(2, 0);
        var result = sb.findPath('AStarFinder');
        result.operations.forEach(function(op) {
            op.should.have.property('x');
            op.should.have.property('y');
            op.should.have.property('attr');
        });
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — scorer integration
// ─────────────────────────────────────────────
describe('ScenarioBuilder — scorer integration', function() {
    it('findPath auto-saves run to RunStore', function() {
        var sb = new ScenarioBuilder({ storage: new MemStorage() });
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 4);
        sb.findPath('AStarFinder');
        sb.runStore.loadRuns().length.should.equal(1);
    });

    it('multiple findPath calls accumulate runs', function() {
        var sb = new ScenarioBuilder({ storage: new MemStorage() });
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 4);
        sb.findPath('AStarFinder');
        sb.findPath('DijkstraFinder');
        sb.findPath('BreadthFirstFinder');
        sb.runStore.loadRuns().length.should.equal(3);
    });

    it('saved run has correct algorithm', function() {
        var sb = new ScenarioBuilder({ storage: new MemStorage() });
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(4, 4);
        sb.findPath('DijkstraFinder');
        var runs = sb.runStore.loadRuns();
        runs[0].algorithm.should.equal('DijkstraFinder');
    });

    it('clearRuns empties store', function() {
        var sb = new ScenarioBuilder({ storage: new MemStorage() });
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(2, 0);
        sb.findPath('AStarFinder');
        sb.runStore.clearRuns();
        sb.runStore.loadRuns().should.eql([]);
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — persistence integration
// ─────────────────────────────────────────────
describe('ScenarioBuilder — persistence integration', function() {
    it('saveScenario returns valid JSON', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(14, 14);
        sb.canvas.toggleWall(5, 5);
        var json = sb.saveScenario();
        json.should.be.a.String();
        (function() { JSON.parse(json); }).should.not.throw();
    });

    it('loadScenario restores grid state', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(1, 2);
        sb.canvas.setEnd(10, 12);
        sb.canvas.toggleWall(5, 5);
        sb.canvas.toggleWall(6, 6);
        var json = sb.saveScenario();

        var sb2 = new ScenarioBuilder();
        sb2.loadScenario(json);
        sb2.canvas.start.should.deepEqual({ x: 1, y: 2 });
        sb2.canvas.end.should.deepEqual({ x: 10, y: 12 });
        sb2.canvas.getCell(5, 5).should.equal('wall');
        sb2.canvas.getCell(6, 6).should.equal('wall');
        sb2.canvas.getCell(0, 0).should.equal('empty');
    });

    it('save→load roundtrip preserves pathfinding result', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(14, 14);
        sb.canvas.toggleWall(7, 7);
        var result1 = sb.findPath('AStarFinder');
        var json = sb.saveScenario();

        var sb2 = new ScenarioBuilder();
        sb2.loadScenario(json);
        var result2 = sb2.findPath('AStarFinder');

        result1.path[0].should.eql(result2.path[0]);
        result1.path[result1.path.length - 1].should.eql(
            result2.path[result2.path.length - 1]);
        result1.metrics.pathLength.should.be.approximately(
            result2.metrics.pathLength, 0.001);
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — preset integration
// ─────────────────────────────────────────────
describe('ScenarioBuilder — preset integration', function() {
    it('loadPreset loads map into canvas', function() {
        var sb = new ScenarioBuilder();
        sb.loadPreset('maze');
        sb.canvas.start.should.not.be.null();
        sb.canvas.end.should.not.be.null();
    });

    it('loadPreset maze produces findable path', function() {
        var sb = new ScenarioBuilder();
        sb.loadPreset('maze');
        var result = sb.findPath('AStarFinder');
        result.path.length.should.be.above(0);
    });

    it('loadPreset bottleneck produces findable path', function() {
        var sb = new ScenarioBuilder();
        sb.loadPreset('bottleneck');
        var result = sb.findPath('AStarFinder');
        result.path.length.should.be.above(0);
    });

    it('loadPreset replaces current grid state', function() {
        var sb = new ScenarioBuilder();
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(14, 14);
        sb.canvas.toggleWall(3, 3);
        sb.loadPreset('empty');
        // empty preset has no walls
        sb.canvas.getCell(3, 3).should.equal('empty');
    });

    it('listAlgorithms returns all finder names', function() {
        var sb = new ScenarioBuilder();
        var algos = sb.listAlgorithms();
        algos.should.be.an.Array();
        algos.should.containEql('AStarFinder');
        algos.should.containEql('DijkstraFinder');
        algos.should.containEql('BreadthFirstFinder');
    });

    it('listPresets returns all preset names', function() {
        var sb = new ScenarioBuilder();
        var presets = sb.listPresets();
        presets.should.containEql('empty');
        presets.should.containEql('maze');
        presets.should.containEql('bottleneck');
    });
});

// ─────────────────────────────────────────────
//  ScenarioBuilder — end-to-end workflow
// ─────────────────────────────────────────────
describe('ScenarioBuilder — end-to-end workflow', function() {
    it('full scenario: build grid → find path → score → save → load → compare', function() {
        var mem = new MemStorage();
        var sb = new ScenarioBuilder({ storage: mem });

        // 1. Build grid
        sb.canvas.setStart(0, 0);
        sb.canvas.setEnd(14, 14);
        sb.canvas.toggleWall(7, 0);
        sb.canvas.toggleWall(7, 1);
        sb.canvas.toggleWall(7, 2);
        sb.canvas.toggleWall(7, 3);

        // 2. Run A*
        var r1 = sb.findPath('AStarFinder');
        r1.path.length.should.be.above(0);
        r1.metrics.algorithm.should.equal('AStarFinder');

        // 3. Run Dijkstra for comparison
        var r2 = sb.findPath('DijkstraFinder');
        r2.path.length.should.be.above(0);

        // 4. Both stored in RunStore
        var runs = sb.runStore.loadRuns();
        runs.length.should.equal(2);
        runs[0].algorithm.should.equal('AStarFinder');
        runs[1].algorithm.should.equal('DijkstraFinder');

        // 5. Save scenario
        var json = sb.saveScenario();

        // 6. Load in new builder
        var sb2 = new ScenarioBuilder({ storage: new MemStorage() });
        sb2.loadScenario(json);

        // 7. Run same algorithms on loaded grid
        var r3 = sb2.findPath('AStarFinder');
        r3.metrics.pathLength.should.be.approximately(
            r1.metrics.pathLength, 0.001);

        // 8. Verify grid state survived
        sb2.canvas.getCell(7, 0).should.equal('wall');
        sb2.canvas.getCell(7, 3).should.equal('wall');
        sb2.canvas.start.should.deepEqual({ x: 0, y: 0 });
        sb2.canvas.end.should.deepEqual({ x: 14, y: 14 });
    });

    it('preset → search → compare multiple algorithms', function() {
        var sb = new ScenarioBuilder({ storage: new MemStorage() });
        sb.loadPreset('bottleneck');

        var algos = ['AStarFinder', 'DijkstraFinder', 'BreadthFirstFinder'];
        var results = algos.map(function(name) {
            return sb.findPath(name);
        });

        // All should find a path
        results.forEach(function(r, i) {
            r.path.length.should.be.above(0,
                algos[i] + ' should find path on bottleneck');
        });

        // All reach same endpoint
        results.forEach(function(r) {
            var start = sb.canvas.start;
            var end = sb.canvas.end;
            r.path[0].should.eql([start.x, start.y]);
            r.path[r.path.length - 1].should.eql([end.x, end.y]);
        });

        // All runs recorded
        sb.runStore.loadRuns().length.should.equal(3);
    });
});
