var PF = require('..');
var Metrics = require('../src/scorer/Metrics');
var RunStore = require('../src/scorer/RunStore');
require('should');

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function makeGrid(matrix) {
    return new PF.Grid(matrix[0].length, matrix.length, matrix);
}

var OPEN5 = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0]
];

// In-memory storage stub (mirrors localStorage API)
function MemStorage() {
    this._data = {};
}
MemStorage.prototype.getItem = function(key) {
    return this._data.hasOwnProperty(key) ? this._data[key] : null;
};
MemStorage.prototype.setItem = function(key, val) {
    this._data[key] = String(val);
};
MemStorage.prototype.removeItem = function(key) {
    delete this._data[key];
};

// ─────────────────────────────────────────────
//  Metrics.captureRun
// ─────────────────────────────────────────────
describe('Metrics.captureRun', function() {
    it('returns an object with required fields', function() {
        var path = [[0,0],[1,0],[2,0]];
        var record = Metrics.captureRun('AStarFinder', path, 12.5, 42);
        record.should.have.property('algorithm').equal('AStarFinder');
        record.should.have.property('pathLength');
        record.should.have.property('nodesExplored').equal(42);
        record.should.have.property('timeMs').equal(12.5);
        record.should.have.property('timestamp');
    });

    it('pathLength is euclidean length of path', function() {
        // 3 steps right along x-axis: each step = 1, total = 2
        var path = [[0,0],[1,0],[2,0]];
        var record = Metrics.captureRun('AStarFinder', path, 1, 10);
        record.pathLength.should.be.above(0);
        record.pathLength.should.be.approximately(2, 0.001);
    });

    it('pathLength is 0 for empty path', function() {
        var record = Metrics.captureRun('AStarFinder', [], 0, 0);
        record.pathLength.should.equal(0);
    });

    it('pathLength is 0 for single-node path', function() {
        var record = Metrics.captureRun('AStarFinder', [[3,3]], 0, 0);
        record.pathLength.should.equal(0);
    });

    it('timestamp is a number (Unix ms)', function() {
        var before = Date.now();
        var record = Metrics.captureRun('AStarFinder', [], 0, 0);
        var after = Date.now();
        record.timestamp.should.be.aboveOrEqual(before);
        record.timestamp.should.be.belowOrEqual(after);
    });

    it('diagonal step has length sqrt(2)', function() {
        var path = [[0,0],[1,1]];
        var record = Metrics.captureRun('AStarFinder', path, 1, 5);
        record.pathLength.should.be.approximately(Math.sqrt(2), 0.0001);
    });
});

// ─────────────────────────────────────────────
//  Metrics.captureRun with live finder
// ─────────────────────────────────────────────
describe('Metrics.captureRun with live A* run', function() {
    it('nodesExplored matches operation count', function() {
        var grid = makeGrid(OPEN5);
        var finder = new PF.AStarFinder();
        var opCount = 0;

        // Instrument node setters to count operations
        var origOpened = Object.getOwnPropertyDescriptor(PF.Node.prototype, 'opened');
        PF.Node.prototype.__defineSetter__('opened', function(v) {
            if (v) opCount++;
            this._opened = v;
        });
        PF.Node.prototype.__defineGetter__('opened', function() {
            return this._opened;
        });

        var path = finder.findPath(0, 0, 4, 4, grid);

        // Restore
        if (origOpened) {
            Object.defineProperty(PF.Node.prototype, 'opened', origOpened);
        }

        var record = Metrics.captureRun('AStarFinder', path, 5.0, opCount);
        record.nodesExplored.should.equal(opCount);
        record.pathLength.should.be.above(0);
    });
});

// ─────────────────────────────────────────────
//  RunStore — basic CRUD
// ─────────────────────────────────────────────
describe('RunStore — empty store', function() {
    it('loadRuns returns empty array initially', function() {
        var store = new RunStore(new MemStorage());
        store.loadRuns().should.eql([]);
    });
});

describe('RunStore.saveRun', function() {
    it('assigns an id to each run', function() {
        var store = new RunStore(new MemStorage());
        var rec = Metrics.captureRun('AStarFinder', [[0,0],[1,0]], 3.14, 7);
        var saved = store.saveRun(rec);
        saved.should.have.property('id');
    });

    it('id is unique per run', function() {
        var store = new RunStore(new MemStorage());
        var r1 = store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        var r2 = store.saveRun(Metrics.captureRun('BreadthFirstFinder', [], 2, 2));
        r1.id.should.not.equal(r2.id);
    });

    it('saved run is returned by loadRuns', function() {
        var store = new RunStore(new MemStorage());
        var rec = Metrics.captureRun('DijkstraFinder', [[0,0],[1,0]], 1.1, 4);
        var saved = store.saveRun(rec);
        var runs = store.loadRuns();
        runs.length.should.equal(1);
        runs[0].id.should.equal(saved.id);
        runs[0].algorithm.should.equal('DijkstraFinder');
    });

    it('multiple runs accumulate', function() {
        var store = new RunStore(new MemStorage());
        store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        store.saveRun(Metrics.captureRun('BreadthFirstFinder', [], 2, 2));
        store.saveRun(Metrics.captureRun('DijkstraFinder', [], 3, 3));
        store.loadRuns().length.should.equal(3);
    });

    it('preserves all metric fields', function() {
        var store = new RunStore(new MemStorage());
        var rec = Metrics.captureRun('AStarFinder', [[0,0],[1,0],[2,0]], 9.9, 15);
        store.saveRun(rec);
        var loaded = store.loadRuns()[0];
        loaded.algorithm.should.equal('AStarFinder');
        loaded.timeMs.should.equal(9.9);
        loaded.nodesExplored.should.equal(15);
        loaded.pathLength.should.be.approximately(2, 0.001);
    });
});

describe('RunStore.clearRuns', function() {
    it('removes all saved runs', function() {
        var store = new RunStore(new MemStorage());
        store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        store.saveRun(Metrics.captureRun('DijkstraFinder', [], 2, 2));
        store.clearRuns();
        store.loadRuns().should.eql([]);
    });

    it('clearRuns on empty store does not throw', function() {
        var store = new RunStore(new MemStorage());
        (function() { store.clearRuns(); }).should.not.throw();
    });
});

describe('RunStore — persistence across instances', function() {
    it('runs survive creating a new RunStore with same storage', function() {
        var mem = new MemStorage();
        var store1 = new RunStore(mem);
        var saved = store1.saveRun(Metrics.captureRun('AStarFinder', [[0,0],[4,4]], 5.5, 20));

        var store2 = new RunStore(mem);
        var runs = store2.loadRuns();
        runs.length.should.equal(1);
        runs[0].id.should.equal(saved.id);
    });
});

describe('RunStore — default storage', function() {
    it('constructs without storage argument', function() {
        (function() { new RunStore(); }).should.not.throw();
    });

    it('loadRuns returns array when no storage given', function() {
        var store = new RunStore();
        store.loadRuns().should.be.an.Array();
    });
});

// ─────────────────────────────────────────────
//  Comparison helpers on RunStore
// ─────────────────────────────────────────────
describe('RunStore.getRunById', function() {
    it('returns run by id', function() {
        var store = new RunStore(new MemStorage());
        var saved = store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        var found = store.getRunById(saved.id);
        found.should.not.be.null;
        found.id.should.equal(saved.id);
    });

    it('returns null for unknown id', function() {
        var store = new RunStore(new MemStorage());
        var result = store.getRunById('nonexistent-id');
        (result === null).should.be.true;
    });
});

describe('RunStore.deleteRun', function() {
    it('removes a single run by id', function() {
        var store = new RunStore(new MemStorage());
        var r1 = store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        var r2 = store.saveRun(Metrics.captureRun('DijkstraFinder', [], 2, 2));
        store.deleteRun(r1.id);
        var runs = store.loadRuns();
        runs.length.should.equal(1);
        runs[0].id.should.equal(r2.id);
    });

    it('no-op for unknown id', function() {
        var store = new RunStore(new MemStorage());
        store.saveRun(Metrics.captureRun('AStarFinder', [], 1, 1));
        (function() { store.deleteRun('fake-id'); }).should.not.throw();
        store.loadRuns().length.should.equal(1);
    });
});
