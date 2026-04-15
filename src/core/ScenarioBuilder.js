/**
 * ScenarioBuilder — integration layer wiring GridCanvas, pathfinding,
 * ScenarioPersistence, and Scorer (Metrics + RunStore) together.
 *
 * Usage:
 *   var sb = new ScenarioBuilder({ cols: 15, rows: 15, storage: localStorage });
 *   sb.canvas.setStart(0, 0);
 *   sb.canvas.setEnd(14, 14);
 *   sb.canvas.toggleWall(7, 7);
 *   var result = sb.findPath('AStarFinder', { weight: 1 });
 *   // result = { path, metrics, operations }
 *   sb.saveScenario();   // → JSON string
 *   sb.loadScenario(json);
 *   sb.loadPreset('maze');
 */

var PF = require('../../index');
var GridCanvas = require('../../visual/js/grid-canvas');
var ScenarioPersistence = require('./ScenarioPersistence');
var Metrics = require('../scorer/Metrics');
var RunStore = require('../scorer/RunStore');

var ALGORITHM_MAP = {
    'AStarFinder':           PF.AStarFinder,
    'BestFirstFinder':       PF.BestFirstFinder,
    'BreadthFirstFinder':    PF.BreadthFirstFinder,
    'DijkstraFinder':        PF.DijkstraFinder,
    'BiAStarFinder':         PF.BiAStarFinder,
    'BiBestFirstFinder':     PF.BiBestFirstFinder,
    'BiBreadthFirstFinder':  PF.BiBreadthFirstFinder,
    'BiDijkstraFinder':      PF.BiDijkstraFinder,
    'IDAStarFinder':         PF.IDAStarFinder,
    'JumpPointFinder':       PF.JumpPointFinder
};

function ScenarioBuilder(opts) {
    opts = opts || {};
    var cols = opts.cols || 15;
    var rows = opts.rows || 15;
    this.canvas = new GridCanvas(cols, rows);
    this.runStore = new RunStore(opts.storage);
}

/**
 * Convert GridCanvas state to a PF.Grid for pathfinding.
 */
ScenarioBuilder.prototype._buildPFGrid = function() {
    var cols = this.canvas.cols;
    var rows = this.canvas.rows;
    var matrix = [];
    for (var r = 0; r < rows; r++) {
        var row = [];
        for (var c = 0; c < cols; c++) {
            row.push(this.canvas.isWalkable(c, r) ? 0 : 1);
        }
        matrix.push(row);
    }
    return new PF.Grid(cols, rows, matrix);
};

/**
 * Run pathfinding on current grid state.
 *
 * @param {string} algorithmName - e.g. 'AStarFinder'
 * @param {Object} [finderOpts] - options passed to finder constructor
 * @returns {{ path: Array, metrics: Object, operations: Array }}
 */
ScenarioBuilder.prototype.findPath = function(algorithmName, finderOpts) {
    if (!this.canvas.start) throw new Error('Start position not set');
    if (!this.canvas.end)   throw new Error('End position not set');

    var FinderClass = ALGORITHM_MAP[algorithmName];
    if (!FinderClass) {
        throw new Error('Unknown algorithm: ' + algorithmName);
    }

    var finder = new FinderClass(finderOpts || {});
    var grid = this._buildPFGrid();

    // Instrument Node prototype to capture operations for animation
    var operations = [];
    var origOpened = Object.getOwnPropertyDescriptor(PF.Node.prototype, 'opened');
    var origClosed = Object.getOwnPropertyDescriptor(PF.Node.prototype, 'closed');
    var origTested = Object.getOwnPropertyDescriptor(PF.Node.prototype, 'tested');

    Object.defineProperty(PF.Node.prototype, 'opened', {
        configurable: true,
        get: function() { return this._opened; },
        set: function(v) {
            this._opened = v;
            operations.push({ x: this.x, y: this.y, attr: 'opened', value: v });
        }
    });
    Object.defineProperty(PF.Node.prototype, 'closed', {
        configurable: true,
        get: function() { return this._closed; },
        set: function(v) {
            this._closed = v;
            operations.push({ x: this.x, y: this.y, attr: 'closed', value: v });
        }
    });
    Object.defineProperty(PF.Node.prototype, 'tested', {
        configurable: true,
        get: function() { return this._tested; },
        set: function(v) {
            this._tested = v;
            operations.push({ x: this.x, y: this.y, attr: 'tested', value: v });
        }
    });

    var sx = this.canvas.start.x, sy = this.canvas.start.y;
    var ex = this.canvas.end.x,   ey = this.canvas.end.y;

    var t0 = Date.now();
    var path = finder.findPath(sx, sy, ex, ey, grid);
    var t1 = Date.now();
    var timeMs = t1 - t0;

    // Restore original property descriptors
    if (origOpened) Object.defineProperty(PF.Node.prototype, 'opened', origOpened);
    else delete PF.Node.prototype.opened;
    if (origClosed) Object.defineProperty(PF.Node.prototype, 'closed', origClosed);
    else delete PF.Node.prototype.closed;
    if (origTested) Object.defineProperty(PF.Node.prototype, 'tested', origTested);
    else delete PF.Node.prototype.tested;

    // Count nodes explored (opened ops with value=true)
    var nodesExplored = 0;
    for (var i = 0; i < operations.length; i++) {
        if (operations[i].attr === 'opened' && operations[i].value) {
            nodesExplored++;
        }
    }

    var metrics = Metrics.captureRun(algorithmName, path, timeMs, nodesExplored);
    this.runStore.saveRun(metrics);

    return {
        path: path,
        metrics: metrics,
        operations: operations
    };
};

/**
 * Save current canvas state as JSON.
 * @returns {string}
 */
ScenarioBuilder.prototype.saveScenario = function() {
    var grid = this._buildPFGrid();
    var sx = this.canvas.start ? this.canvas.start.x : 0;
    var sy = this.canvas.start ? this.canvas.start.y : 0;
    var ex = this.canvas.end ? this.canvas.end.x : this.canvas.cols - 1;
    var ey = this.canvas.end ? this.canvas.end.y : this.canvas.rows - 1;
    return ScenarioPersistence.saveScenario(grid, sx, sy, ex, ey);
};

/**
 * Load a scenario from JSON into canvas.
 * @param {string} json
 */
ScenarioBuilder.prototype.loadScenario = function(json) {
    var data = ScenarioPersistence.loadScenario(json);
    this._applyScenarioData(data);
};

/**
 * Load a preset map into canvas.
 * @param {string} name - preset name (e.g. 'maze', 'bottleneck')
 */
ScenarioBuilder.prototype.loadPreset = function(name) {
    var data = ScenarioPersistence.getPreset(name);
    this._applyScenarioData(data);
};

/**
 * Apply loaded scenario data to canvas.
 * @private
 */
ScenarioBuilder.prototype._applyScenarioData = function(data) {
    // Resize canvas if needed
    if (data.grid.width !== this.canvas.cols || data.grid.height !== this.canvas.rows) {
        this.canvas = new GridCanvas(data.grid.width, data.grid.height);
    } else {
        this.canvas.reset();
    }

    // Set walls
    for (var y = 0; y < data.grid.height; y++) {
        for (var x = 0; x < data.grid.width; x++) {
            if (!data.grid.isWalkableAt(x, y)) {
                this.canvas.toggleWall(x, y);
            }
        }
    }

    // Set start and end
    this.canvas.setStart(data.start[0], data.start[1]);
    this.canvas.setEnd(data.end[0], data.end[1]);
};

/**
 * List available algorithm names.
 * @returns {string[]}
 */
ScenarioBuilder.prototype.listAlgorithms = function() {
    return Object.keys(ALGORITHM_MAP);
};

/**
 * List available preset names.
 * @returns {string[]}
 */
ScenarioBuilder.prototype.listPresets = function() {
    return ScenarioPersistence.listPresets();
};

module.exports = ScenarioBuilder;
