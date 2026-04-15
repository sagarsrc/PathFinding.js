/**
 * GridCanvas — pure state model for an interactive pathfinding scenario builder.
 *
 * No DOM / Raphael dependency; safe to require in Node for testing.
 *
 * Cell types: 'empty' | 'wall' | 'start' | 'end'
 *
 * API:
 *   getCell(x, y)          → cell type string
 *   toggleWall(x, y)       → flip empty↔wall (noop on start/end)
 *   setStart(x, y)         → place/move start marker
 *   setEnd(x, y)           → place/move end marker
 *   isWalkable(x, y)       → true unless wall
 *   clearWalls()           → remove all walls, keep start/end
 *   reset()                → clear everything
 *   getState()             → { grid, start, end, walls } snapshot
 *   setState(state)        → restore from snapshot
 */
function GridCanvas(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.start = null;
    this.end   = null;
    this._grid = this._makeGrid(cols, rows);
}

GridCanvas.prototype._makeGrid = function(cols, rows) {
    var grid = new Array(rows);
    for (var r = 0; r < rows; r++) {
        grid[r] = new Array(cols);
        for (var c = 0; c < cols; c++) {
            grid[r][c] = 'empty';
        }
    }
    return grid;
};

GridCanvas.prototype._assertInBounds = function(x, y) {
    if (x < 0 || x >= this.cols || y < 0 || y >= this.rows) {
        throw new RangeError('(' + x + ', ' + y + ') out of bounds ' +
                             this.cols + 'x' + this.rows);
    }
};

GridCanvas.prototype.getCell = function(x, y) {
    this._assertInBounds(x, y);
    return this._grid[y][x];
};

GridCanvas.prototype.toggleWall = function(x, y) {
    this._assertInBounds(x, y);
    var cell = this._grid[y][x];
    if (cell === 'start' || cell === 'end') return; // protected
    this._grid[y][x] = (cell === 'wall') ? 'empty' : 'wall';
};

GridCanvas.prototype.setStart = function(x, y) {
    this._assertInBounds(x, y);
    if (this.end && this.end.x === x && this.end.y === y) {
        throw new Error('Cannot place start on end cell');
    }
    // Clear old start
    if (this.start) {
        this._grid[this.start.y][this.start.x] = 'empty';
    }
    this.start = { x: x, y: y };
    this._grid[y][x] = 'start';
};

GridCanvas.prototype.setEnd = function(x, y) {
    this._assertInBounds(x, y);
    if (this.start && this.start.x === x && this.start.y === y) {
        throw new Error('Cannot place end on start cell');
    }
    // Clear old end
    if (this.end) {
        this._grid[this.end.y][this.end.x] = 'empty';
    }
    this.end = { x: x, y: y };
    this._grid[y][x] = 'end';
};

GridCanvas.prototype.isWalkable = function(x, y) {
    this._assertInBounds(x, y);
    return this._grid[y][x] !== 'wall';
};

GridCanvas.prototype.clearWalls = function() {
    for (var r = 0; r < this.rows; r++) {
        for (var c = 0; c < this.cols; c++) {
            if (this._grid[r][c] === 'wall') {
                this._grid[r][c] = 'empty';
            }
        }
    }
};

GridCanvas.prototype.reset = function() {
    this.start = null;
    this.end   = null;
    this._grid = this._makeGrid(this.cols, this.rows);
};

GridCanvas.prototype.getState = function() {
    var r, c, walls = [];
    var grid = new Array(this.rows);
    for (r = 0; r < this.rows; r++) {
        grid[r] = new Array(this.cols);
        for (c = 0; c < this.cols; c++) {
            grid[r][c] = this._grid[r][c];
            if (this._grid[r][c] === 'wall') {
                walls.push({ x: c, y: r });
            }
        }
    }
    return {
        grid:  grid,
        start: this.start ? { x: this.start.x, y: this.start.y } : null,
        end:   this.end   ? { x: this.end.x,   y: this.end.y   } : null,
        walls: walls
    };
};

GridCanvas.prototype.setState = function(state) {
    this.reset();
    var r, c;
    for (r = 0; r < this.rows; r++) {
        for (c = 0; c < this.cols; c++) {
            var type = state.grid[r][c];
            if (type === 'wall') {
                this._grid[r][c] = 'wall';
            }
        }
    }
    if (state.start) this.setStart(state.start.x, state.start.y);
    if (state.end)   this.setEnd(state.end.x, state.end.y);
};

// Node.js export (browser usage via global)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridCanvas;
}
