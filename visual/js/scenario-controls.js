/**
 * ScenarioControls — pure-logic module for the scenario builder control panel.
 *
 * Handles: algorithm registry, grid serialization/deserialization,
 * preset maps, grid-size validation, speed config.
 *
 * No DOM dependencies — fully testable in Node.js.
 */
(function(root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        // Node.js / CommonJS (tests)
        var PF = require('../../');
        module.exports = factory(PF);
    } else {
        // Browser global
        root.ScenarioControls = factory(root.PF);
    }
}(this, function(PF) {

    // ─── Algorithm registry ────────────────────────────────────────────────
    var ALGORITHMS = [
        { id: 'AStarFinder',           label: 'A*' },
        { id: 'BiAStarFinder',         label: 'Bi-directional A*' },
        { id: 'BestFirstFinder',       label: 'Best-First' },
        { id: 'BiBestFirstFinder',     label: 'Bi-directional Best-First' },
        { id: 'BreadthFirstFinder',    label: 'Breadth-First Search' },
        { id: 'BiBreadthFirstFinder',  label: 'Bi-directional BFS' },
        { id: 'DijkstraFinder',        label: 'Dijkstra' },
        { id: 'BiDijkstraFinder',      label: 'Bi-directional Dijkstra' },
        { id: 'IDAStarFinder',         label: 'IDA*' },
        { id: 'JumpPointFinder',       label: 'Jump Point Search' },
    ];

    // ─── Speed config (operations per second) ─────────────────────────────
    var SPEED_CONFIG = {
        min: 10,
        default: 200,
        max: 1000,
    };

    // ─── Grid size ─────────────────────────────────────────────────────────
    var GRID_SIZE_DEFAULT = { width: 15, height: 15 };
    var GRID_SIZE_MIN = 5;
    var GRID_SIZE_MAX = 50;

    // ─── validateGridSize ──────────────────────────────────────────────────
    function validateGridSize(width, height) {
        if (!Number.isInteger(width) || !Number.isInteger(height)) return false;
        if (width < GRID_SIZE_MIN || height < GRID_SIZE_MIN) return false;
        if (width > GRID_SIZE_MAX || height > GRID_SIZE_MAX) return false;
        return true;
    }

    // ─── serializeGrid ─────────────────────────────────────────────────────
    /**
     * Convert a PF.Grid + start/end positions to a plain object.
     * @param {PF.Grid} grid
     * @param {number} startX
     * @param {number} startY
     * @param {number} endX
     * @param {number} endY
     * @returns {Object}
     */
    function serializeGrid(grid, startX, startY, endX, endY) {
        var walls = [];
        for (var y = 0; y < grid.height; y++) {
            for (var x = 0; x < grid.width; x++) {
                if (!grid.isWalkableAt(x, y)) {
                    walls.push([x, y]);
                }
            }
        }
        return {
            version: '1',
            width:   grid.width,
            height:  grid.height,
            startX:  startX,
            startY:  startY,
            endX:    endX,
            endY:    endY,
            walls:   walls,
        };
    }

    // ─── deserializeGrid ───────────────────────────────────────────────────
    /**
     * Restore a PF.Grid from a serialized scenario object or JSON string.
     * @param {Object|string} data
     * @returns {{ grid: PF.Grid, startX: number, startY: number, endX: number, endY: number }}
     */
    function deserializeGrid(data) {
        var scenario = (typeof data === 'string') ? JSON.parse(data) : data;

        if (!scenario.version) {
            throw new Error('Invalid scenario: missing version');
        }
        if (!scenario.width || !scenario.height ||
            scenario.width <= 0 || scenario.height <= 0) {
            throw new Error('Invalid scenario: bad dimensions');
        }

        var grid = new PF.Grid(scenario.width, scenario.height);

        (scenario.walls || []).forEach(function(wall) {
            grid.setWalkableAt(wall[0], wall[1], false);
        });

        return {
            grid:   grid,
            startX: scenario.startX,
            startY: scenario.startY,
            endX:   scenario.endX,
            endY:   scenario.endY,
        };
    }

    // ─── Preset maps ───────────────────────────────────────────────────────
    function makeEmptyScenario(w, h, sx, sy, ex, ey) {
        return { version: '1', width: w, height: h, startX: sx, startY: sy, endX: ex, endY: ey, walls: [] };
    }

    var PRESETS = [
        {
            id: 'empty',
            label: 'Empty 15×15',
            scenario: makeEmptyScenario(15, 15, 1, 7, 13, 7),
        },
        {
            id: 'corridor',
            label: 'Single Corridor',
            scenario: (function() {
                // Horizontal walls top and bottom, open middle corridor
                var walls = [];
                for (var x = 0; x < 15; x++) {
                    if (x !== 0 && x !== 14) {
                        walls.push([x, 3]);
                        walls.push([x, 11]);
                    }
                }
                return { version: '1', width: 15, height: 15,
                         startX: 1, startY: 7, endX: 13, endY: 7, walls: walls };
            }()),
        },
        {
            id: 'maze',
            label: 'Simple Maze',
            scenario: (function() {
                // Alternating horizontal barriers with gaps
                var walls = [];
                var rows = [2, 4, 6, 8, 10, 12];
                rows.forEach(function(row, i) {
                    for (var x = 0; x < 14; x++) {
                        // Gap on left for even rows, right for odd rows
                        var gapX = (i % 2 === 0) ? 13 : 0;
                        if (x !== gapX) walls.push([x, row]);
                    }
                });
                return { version: '1', width: 15, height: 15,
                         startX: 1, startY: 0, endX: 13, endY: 14, walls: walls };
            }()),
        },
        {
            id: 'diagonal_barrier',
            label: 'Diagonal Barrier',
            scenario: (function() {
                var walls = [];
                for (var i = 1; i < 14; i++) {
                    walls.push([i, i]);
                }
                return { version: '1', width: 15, height: 15,
                         startX: 0, startY: 7, endX: 14, endY: 7, walls: walls };
            }()),
        },
        {
            id: 'spiral',
            label: 'Spiral Barrier',
            scenario: (function() {
                var walls = [];
                // Outer ring (incomplete — gaps for path)
                for (var x = 2; x < 13; x++) { walls.push([x, 2]); }
                for (var y = 3; y < 13; y++) { walls.push([12, y]); }
                for (var x2 = 3; x2 < 12; x2++) { walls.push([x2, 12]); }
                for (var y2 = 4; y2 < 11; y2++) { walls.push([3, y2]); }
                // Inner ring
                for (var x3 = 5; x3 < 11; x3++) { walls.push([x3, 4]); }
                for (var y3 = 5; y3 < 10; y3++) { walls.push([10, y3]); }
                for (var x4 = 5; x4 < 10; x4++) { walls.push([x4, 10]); }
                return { version: '1', width: 15, height: 15,
                         startX: 0, startY: 0, endX: 7, endY: 7, walls: walls };
            }()),
        },
    ];

    return {
        ALGORITHMS:         ALGORITHMS,
        SPEED_CONFIG:       SPEED_CONFIG,
        GRID_SIZE_DEFAULT:  GRID_SIZE_DEFAULT,
        GRID_SIZE_MIN:      GRID_SIZE_MIN,
        GRID_SIZE_MAX:      GRID_SIZE_MAX,
        PRESETS:            PRESETS,
        validateGridSize:   validateGridSize,
        serializeGrid:      serializeGrid,
        deserializeGrid:    deserializeGrid,
    };
}));
