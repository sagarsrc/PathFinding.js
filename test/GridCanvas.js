var GridCanvas = require('../visual/js/grid-canvas');

describe('GridCanvas', function() {
    var canvas;

    beforeEach(function() {
        canvas = new GridCanvas(15, 15);
    });

    describe('initialization', function() {
        it('should have correct dimensions', function() {
            canvas.cols.should.equal(15);
            canvas.rows.should.equal(15);
        });

        it('should start with all cells empty', function() {
            for (var r = 0; r < 15; r++) {
                for (var c = 0; c < 15; c++) {
                    canvas.getCell(c, r).should.equal('empty');
                }
            }
        });

        it('should have no start or end initially', function() {
            (canvas.start === null).should.be.true;
            (canvas.end === null).should.be.true;
        });
    });

    describe('wall toggling', function() {
        it('should toggle empty cell to wall', function() {
            canvas.toggleWall(3, 4);
            canvas.getCell(3, 4).should.equal('wall');
        });

        it('should toggle wall back to empty', function() {
            canvas.toggleWall(3, 4);
            canvas.toggleWall(3, 4);
            canvas.getCell(3, 4).should.equal('empty');
        });

        it('should not toggle wall on start cell', function() {
            canvas.setStart(2, 2);
            canvas.toggleWall(2, 2);
            canvas.getCell(2, 2).should.equal('start');
        });

        it('should not toggle wall on end cell', function() {
            canvas.setEnd(5, 5);
            canvas.toggleWall(5, 5);
            canvas.getCell(5, 5).should.equal('end');
        });

        it('should throw on out-of-bounds toggle', function() {
            (function() { canvas.toggleWall(-1, 0); }).should.throw();
            (function() { canvas.toggleWall(0, 15); }).should.throw();
        });
    });

    describe('start placement', function() {
        it('should set start position', function() {
            canvas.setStart(1, 2);
            canvas.getCell(1, 2).should.equal('start');
            canvas.start.should.deepEqual({ x: 1, y: 2 });
        });

        it('should move start, clearing old position', function() {
            canvas.setStart(1, 2);
            canvas.setStart(5, 6);
            canvas.getCell(1, 2).should.equal('empty');
            canvas.getCell(5, 6).should.equal('start');
        });

        it('should clear wall when start placed on wall', function() {
            canvas.toggleWall(3, 3);
            canvas.setStart(3, 3);
            canvas.getCell(3, 3).should.equal('start');
        });

        it('should throw on out-of-bounds start', function() {
            (function() { canvas.setStart(15, 0); }).should.throw();
        });
    });

    describe('end placement', function() {
        it('should set end position', function() {
            canvas.setEnd(7, 8);
            canvas.getCell(7, 8).should.equal('end');
            canvas.end.should.deepEqual({ x: 7, y: 8 });
        });

        it('should move end, clearing old position', function() {
            canvas.setEnd(7, 8);
            canvas.setEnd(9, 10);
            canvas.getCell(7, 8).should.equal('empty');
            canvas.getCell(9, 10).should.equal('end');
        });

        it('should clear wall when end placed on wall', function() {
            canvas.toggleWall(6, 6);
            canvas.setEnd(6, 6);
            canvas.getCell(6, 6).should.equal('end');
        });

        it('should not allow end on same cell as start', function() {
            canvas.setStart(3, 3);
            (function() { canvas.setEnd(3, 3); }).should.throw();
        });

        it('should not allow start on same cell as end', function() {
            canvas.setEnd(3, 3);
            (function() { canvas.setStart(3, 3); }).should.throw();
        });
    });

    describe('getState API', function() {
        it('should return full grid state snapshot', function() {
            canvas.setStart(0, 0);
            canvas.setEnd(14, 14);
            canvas.toggleWall(5, 5);

            var state = canvas.getState();
            state.should.have.property('grid');
            state.should.have.property('start');
            state.should.have.property('end');
            state.should.have.property('walls');

            state.start.should.deepEqual({ x: 0, y: 0 });
            state.end.should.deepEqual({ x: 14, y: 14 });
            state.walls.should.be.an.Array();
            state.walls.length.should.equal(1);
            state.walls[0].should.deepEqual({ x: 5, y: 5 });
        });

        it('grid matrix should have 15 rows of 15 cols', function() {
            var state = canvas.getState();
            state.grid.length.should.equal(15);
            state.grid[0].length.should.equal(15);
        });

        it('grid matrix values should reflect cell types', function() {
            canvas.setStart(0, 0);
            canvas.setEnd(14, 14);
            canvas.toggleWall(7, 7);

            var state = canvas.getState();
            state.grid[0][0].should.equal('start');
            state.grid[14][14].should.equal('end');
            state.grid[7][7].should.equal('wall');
            state.grid[1][1].should.equal('empty');
        });
    });

    describe('setState API', function() {
        it('should restore grid from state snapshot', function() {
            canvas.setStart(1, 1);
            canvas.setEnd(13, 13);
            canvas.toggleWall(4, 4);
            canvas.toggleWall(8, 8);

            var state = canvas.getState();
            var canvas2 = new GridCanvas(15, 15);
            canvas2.setState(state);

            canvas2.getCell(1, 1).should.equal('start');
            canvas2.getCell(13, 13).should.equal('end');
            canvas2.getCell(4, 4).should.equal('wall');
            canvas2.getCell(8, 8).should.equal('wall');
            canvas2.getCell(0, 0).should.equal('empty');
        });
    });

    describe('clearWalls API', function() {
        it('should remove all walls', function() {
            canvas.toggleWall(1, 1);
            canvas.toggleWall(2, 2);
            canvas.toggleWall(3, 3);
            canvas.clearWalls();
            canvas.getCell(1, 1).should.equal('empty');
            canvas.getCell(2, 2).should.equal('empty');
            canvas.getCell(3, 3).should.equal('empty');
        });

        it('should not affect start/end', function() {
            canvas.setStart(0, 0);
            canvas.setEnd(14, 14);
            canvas.toggleWall(5, 5);
            canvas.clearWalls();
            canvas.getCell(0, 0).should.equal('start');
            canvas.getCell(14, 14).should.equal('end');
        });
    });

    describe('reset API', function() {
        it('should clear everything', function() {
            canvas.setStart(1, 1);
            canvas.setEnd(13, 13);
            canvas.toggleWall(5, 5);
            canvas.reset();
            canvas.getCell(1, 1).should.equal('empty');
            canvas.getCell(13, 13).should.equal('empty');
            canvas.getCell(5, 5).should.equal('empty');
            (canvas.start === null).should.be.true;
            (canvas.end === null).should.be.true;
        });
    });

    describe('isWalkable API', function() {
        it('empty cell is walkable', function() {
            canvas.isWalkable(3, 3).should.be.true;
        });

        it('wall is not walkable', function() {
            canvas.toggleWall(3, 3);
            canvas.isWalkable(3, 3).should.be.false;
        });

        it('start cell is walkable', function() {
            canvas.setStart(3, 3);
            canvas.isWalkable(3, 3).should.be.true;
        });

        it('end cell is walkable', function() {
            canvas.setEnd(3, 3);
            canvas.isWalkable(3, 3).should.be.true;
        });
    });
});
