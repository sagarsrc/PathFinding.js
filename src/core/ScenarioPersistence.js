var Grid = require('./Grid');

// ─────────────────────────────────────────────
//  Preset map definitions (15x15, 1=wall 0=open)
// ─────────────────────────────────────────────

function makeEmpty() {
    var m = [];
    for (var y = 0; y < 15; y++) {
        var row = [];
        for (var x = 0; x < 15; x++) row.push(0);
        m.push(row);
    }
    return m;
}

function makeMaze() {
    // Recursive-division-style fixed maze
    var m = makeEmpty();
    // Outer walls handled by grid bounds; inner walls create corridors
    var walls = [
        // horizontal walls with gaps
        [1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],
        [2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],[12,4],[13,4],
        [1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],
        [2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8],[10,8],[11,8],[12,8],[13,8],
        [1,10],[2,10],[3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],[10,10],[11,10],[12,10],
        [2,12],[3,12],[4,12],[5,12],[6,12],[7,12],[8,12],[9,12],[10,12],[11,12],[12,12],[13,12],
    ];
    walls.forEach(function(w) { m[w[1]][w[0]] = 1; });
    return m;
}

function makeSpiral() {
    var m = makeEmpty();
    // Spiral walls working inward, each ring leaves one gap
    var rings = [
        // ring 1 (outermost interior ring at x=1,y=1)
        { top:1, left:1, bottom:13, right:13, gap: { side:'top', pos:1 } },
        { top:3, left:3, bottom:11, right:11, gap: { side:'right', pos:11 } },
        { top:5, left:5, bottom:9,  right:9,  gap: { side:'bottom', pos:5 } },
        { top:7, left:7, bottom:7,  right:7,  gap: null },
    ];

    rings.forEach(function(ring) {
        var t = ring.top, l = ring.left, b = ring.bottom, r = ring.right;
        var gap = ring.gap;

        // top wall
        for (var x = l; x <= r; x++) {
            if (!gap || gap.side !== 'top' || x !== gap.pos) m[t][x] = 1;
        }
        // right wall
        for (var y = t + 1; y <= b; y++) {
            if (!gap || gap.side !== 'right' || y !== gap.pos) m[y][r] = 1;
        }
        // bottom wall (l..r-1)
        for (var x2 = l; x2 < r; x2++) {
            if (!gap || gap.side !== 'bottom' || x2 !== gap.pos) m[b][x2] = 1;
        }
        // left wall (t+1..b-1)
        for (var y2 = t + 1; y2 < b; y2++) {
            if (!gap || gap.side !== 'left' || y2 !== gap.pos) m[y2][l] = 1;
        }
    });

    return m;
}

function makeBottleneck() {
    // Two open regions connected by narrow 1-cell passage
    var m = makeEmpty();
    var midY = 7;
    // horizontal wall spanning full grid except one passage at x=7
    for (var x = 0; x < 15; x++) {
        if (x !== 7) m[midY][x] = 1;
    }
    return m;
}

function makeRandom() {
    // Deterministic "random" via LCG seed so preset is reproducible
    var seed = 42;
    function rand() {
        seed = (seed * 1664525 + 1013904223) & 0xffffffff;
        return (seed >>> 0) / 0xffffffff;
    }
    var m = makeEmpty();
    for (var y = 0; y < 15; y++) {
        for (var x = 0; x < 15; x++) {
            // ~30% wall density, skip corners for start/end
            if ((x === 0 && y === 0) || (x === 14 && y === 14)) continue;
            if (rand() < 0.3) m[y][x] = 1;
        }
    }
    return m;
}

function matrixToGrid(m) {
    return new Grid(m[0].length, m.length, m);
}

var PRESETS = {
    empty: {
        matrix: makeEmpty,
        start: [0, 0],
        end: [14, 14]
    },
    maze: {
        matrix: makeMaze,
        start: [0, 0],
        end: [14, 14]
    },
    spiral: {
        matrix: makeSpiral,
        start: [0, 0],
        end: [14, 14]
    },
    bottleneck: {
        matrix: makeBottleneck,
        start: [7, 0],
        end: [7, 14]
    },
    random: {
        matrix: makeRandom,
        start: [0, 0],
        end: [14, 14]
    }
};

// ─────────────────────────────────────────────
//  Public API
// ─────────────────────────────────────────────

/**
 * Serialize a scenario to JSON string.
 * @param {Grid} grid
 * @param {number} startX
 * @param {number} startY
 * @param {number} endX
 * @param {number} endY
 * @returns {string}
 */
function saveScenario(grid, startX, startY, endX, endY) {
    var matrix = [];
    for (var y = 0; y < grid.height; y++) {
        var row = [];
        for (var x = 0; x < grid.width; x++) {
            row.push(grid.isWalkableAt(x, y) ? 0 : 1);
        }
        matrix.push(row);
    }
    return JSON.stringify({
        width: grid.width,
        height: grid.height,
        start: [startX, startY],
        end: [endX, endY],
        matrix: matrix
    });
}

/**
 * Deserialize a scenario from JSON string.
 * @param {string} json
 * @returns {{ grid: Grid, start: number[], end: number[] }}
 */
function loadScenario(json) {
    var data = JSON.parse(json);  // throws SyntaxError on bad JSON
    if (!data.matrix) {
        throw new Error('Invalid scenario: missing matrix');
    }
    return {
        grid: matrixToGrid(data.matrix),
        start: data.start,
        end: data.end
    };
}

/**
 * Get a built-in preset scenario.
 * @param {string} name - 'empty' | 'maze' | 'spiral' | 'bottleneck' | 'random'
 * @returns {{ grid: Grid, start: number[], end: number[] }}
 */
function getPreset(name) {
    if (!PRESETS.hasOwnProperty(name)) {
        throw new Error('Unknown preset: ' + name);
    }
    var def = PRESETS[name];
    var m = def.matrix();
    return {
        grid: matrixToGrid(m),
        start: def.start.slice(),
        end: def.end.slice()
    };
}

/**
 * List available preset names.
 * @returns {string[]}
 */
function listPresets() {
    return Object.keys(PRESETS);
}

module.exports = {
    saveScenario: saveScenario,
    loadScenario: loadScenario,
    getPreset: getPreset,
    listPresets: listPresets
};
