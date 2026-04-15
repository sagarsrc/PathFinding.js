var PF = require('..');

describe('Utility functions', function () {
    describe('backtrace', function () {
        it('should return single-element path for root node', function () {
            var n = { x: 3, y: 4, parent: null };
            PF.Util.backtrace(n).should.eql([[3, 4]]);
        });

        it('should return path in start-to-end order', function () {
            var a = { x: 0, y: 0, parent: null };
            var b = { x: 1, y: 0, parent: a };
            var c = { x: 2, y: 1, parent: b };
            PF.Util.backtrace(c).should.eql([[0, 0], [1, 0], [2, 1]]);
        });
    });

    describe('biBacktrace', function () {
        it('should concat two chains into full path', function () {
            // chain A: (0,0) <- (1,0) <- (2,0)
            var a0 = { x: 0, y: 0, parent: null };
            var a1 = { x: 1, y: 0, parent: a0 };
            var meetA = { x: 2, y: 0, parent: a1 };
            // chain B (from end): (5,0) <- (4,0) <- (3,0)
            var b0 = { x: 5, y: 0, parent: null };
            var b1 = { x: 4, y: 0, parent: b0 };
            var meetB = { x: 3, y: 0, parent: b1 };
            // pathA = [[0,0],[1,0],[2,0]], pathB reversed = [[3,0],[4,0],[5,0]]
            PF.Util.biBacktrace(meetA, meetB).should.eql([
                [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]
            ]);
        });
    });

    describe('pathLength', function () {
        it('empty path → 0', function () {
            PF.Util.pathLength([]).should.equal(0);
        });

        it('single point → 0', function () {
            PF.Util.pathLength([[3, 4]]).should.equal(0);
        });

        it('horizontal segment', function () {
            PF.Util.pathLength([[0, 0], [3, 0]]).should.equal(3);
        });

        it('vertical segment', function () {
            PF.Util.pathLength([[0, 0], [0, 4]]).should.equal(4);
        });

        it('multi-segment L-shape', function () {
            PF.Util.pathLength([[0, 0], [3, 0], [3, 4]]).should.equal(7);
        });

        it('diagonal segment', function () {
            var len = PF.Util.pathLength([[0, 0], [3, 3]]);
            (Math.abs(len - 3 * Math.sqrt(2)) < 1e-9).should.be.true();
        });
    });

    describe('smoothenPath', function () {
        it('empty path → empty array', function () {
            var grid = new PF.Grid(5, 5);
            PF.Util.smoothenPath(grid, []).should.eql([]);
        });

        it('single point → same point', function () {
            var grid = new PF.Grid(5, 5);
            PF.Util.smoothenPath(grid, [[2, 2]]).should.eql([[2, 2]]);
        });

        it('straight-line path unchanged', function () {
            var grid = new PF.Grid(5, 1);
            var path = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]];
            var smoothed = PF.Util.smoothenPath(grid, path);
            smoothed[0].should.eql([0, 0]);
            smoothed[smoothed.length - 1].should.eql([4, 0]);
        });

        it('open grid: zigzag collapses to start+end', function () {
            var grid = new PF.Grid(5, 5);
            // zigzag down then right, all open
            var path = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]];
            var smoothed = PF.Util.smoothenPath(grid, path);
            smoothed[0].should.eql([0, 0]);
            smoothed[smoothed.length - 1].should.eql([2, 2]);
            smoothed.length.should.be.belowOrEqual(path.length);
        });

        it('wall blocks shortcut: intermediate waypoint preserved', function () {
            // 3×3 grid, wall at (1,1)
            var matrix = [
                [0, 0, 0],
                [0, 1, 0],
                [0, 0, 0]
            ];
            var grid = new PF.Grid(matrix);
            // path goes around the wall
            var path = [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]];
            var smoothed = PF.Util.smoothenPath(grid, path);
            smoothed[0].should.eql([0, 0]);
            smoothed[smoothed.length - 1].should.eql([2, 2]);
            // direct line from (0,0) to (2,2) passes through (1,1) which is blocked
            // so smoothed path must have an intermediate waypoint
            smoothed.length.should.be.above(2);
        });
    });

    describe('interpolate', function () {
        it('should return the interpolated path', function () {
            PF.Util.interpolate(0, 1, 0, 4).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]);
        });

        it('horizontal line (dy=0)', function () {
            PF.Util.interpolate(0, 3, 5, 3).should.eql([
                [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3]
            ]);
        });

        it('diagonal line', function () {
            PF.Util.interpolate(0, 0, 3, 3).should.eql([
                [0, 0], [1, 1], [2, 2], [3, 3]
            ]);
        });

        it('same point', function () {
            PF.Util.interpolate(2, 2, 2, 2).should.eql([[2, 2]]);
        });

        it('negative direction diagonal', function () {
            PF.Util.interpolate(5, 5, 0, 0).should.eql([
                [5, 5], [4, 4], [3, 3], [2, 2], [1, 1], [0, 0]
            ]);
        });
    });

    describe('expandPath', function () {
        it('should return an empty array given an empty array', function () {
            PF.Util.expandPath([]).should.eql([]);
        });

        it('single point → empty array (len < 2)', function () {
            PF.Util.expandPath([[3, 4]]).should.eql([]);
        });

        it('should return the expanded path', function () {
            PF.Util.expandPath([
                [0, 1], [0, 4]
            ]).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]);

            PF.Util.expandPath([
                [0, 1], [0, 4], [2, 6]
            ]).should.eql([
                [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]
            ]);
        });
    });

    describe('compressPath', function () {
        it('should return the original path if it is too short to compress', function () {
            PF.Util.compressPath([]).should.eql([]);
        });

        it('single point → same point', function () {
            PF.Util.compressPath([[3, 4]]).should.eql([[3, 4]]);
        });

        it('two points → same two points', function () {
            PF.Util.compressPath([[0, 0], [1, 1]]).should.eql([[0, 0], [1, 1]]);
        });

        it('should return a compressed path', function () {
            PF.Util.compressPath([
                [0, 1], [0, 2], [0, 3], [0, 4]
            ]).should.eql([
                [0, 1], [0, 4]
            ]);

            PF.Util.compressPath([
                [0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [2, 6]
            ]).should.eql([
                [0, 1], [0, 4], [2, 6]
            ]);
        });
    });

});
