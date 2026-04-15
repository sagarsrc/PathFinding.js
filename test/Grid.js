var PF = require('..');
var Grid = PF.Grid;
var DiagonalMovement = PF.DiagonalMovement;

describe('Grid', function() {
    describe('generate without matrix', function() {
        var width, height, grid;

        beforeEach(function() {
            width = 10;
            height = 20;
            grid = new Grid(width, height);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should set all nodes\' walkable attribute', function() {
            for (var i = 0; i < height; ++i) {
                for (var j = 0; j < width; ++j) {
                    grid.isWalkableAt(j, i).should.be.true;
                }
            }
        });
    });

    describe('generate with matrix', function() {
        var matrix, grid, width, height;

        var enumPos = function(f, o) {
            for (var y = 0; y < height; ++y) {
                for (var x = 0; x < width; ++x) {
                    if (o) {
                        f.call(o, x, y, grid);
                    } else {
                        f(x, y, grid);
                    }
                }
            }
        };

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];
            height = matrix.length;
            width = matrix[0].length;
            grid = new Grid(width, height, matrix);
        });

        it('should have correct size', function() {
            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width); 
            }
        });

        it('should initiate all nodes\' walkable attribute', function() {
            enumPos(function(x, y, g) {
                if (matrix[y][x]) {
                    g.isWalkableAt(x, y).should.be.false;
                } else {
                    g.isWalkableAt(x, y).should.be.true;
                }
            });
        });

        it('should be able to set nodes\' walkable attribute', function() {
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, false); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.false;
            })
            enumPos(function(x, y) {
                grid.setWalkableAt(x, y, true); 
            });
            enumPos(function(x, y) {
                grid.isWalkableAt(x, y).should.be.true;
            })
        });

        it('should return correct answer for position validity query', function() {
            var asserts = [
                [0, 0, true],
                [0, height - 1, true],
                [width - 1, 0, true],
                [width - 1, height - 1, true],
                [-1, -1, false],
                [0, -1, false],
                [-1, 0, false],
                [0, height, false],
                [width, 0, false],
                [width, height, false],
            ];

            asserts.forEach(function(v, i, a) {
                grid.isInside(v[0], v[1]).should.equal(v[2]);
            });
        });

        it('should return correct neighbors', function() {
            grid.getNeighbors(grid.nodes[1][0], DiagonalMovement.Never).should.eql([ grid.nodes[2][0] ]);
            var cmp = function(a, b) {
                return a.x * 100 + a.y - b.x * 100 - b.y;
            };
            grid.getNeighbors(grid.nodes[0][2], DiagonalMovement.IfAtMostOneObstacle).sort(cmp).should.eql([
                grid.nodes[0][1], grid.nodes[1][2], grid.nodes[1][3]
            ].sort(cmp))
        });
    });

    describe('generate with matrix and no width or height', function() {
        var matrix, grid;

        beforeEach(function() {
            matrix = [
                [1, 0, 0, 1],
                [0, 1, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 1],
            ];

            grid = new Grid(matrix);
        });

        it('should have correct size', function() {
            var height = matrix.length;
            var width = matrix[0].length;

            grid.width.should.equal(width);
            grid.height.should.equal(height);

            grid.nodes.length.should.equal(height);
            for (var i = 0; i < height; ++i) {
                grid.nodes[i].length.should.equal(width);
            }
        });
    });

    describe('clone', function() {
        it('should preserve dimensions', function() {
            var grid = new Grid(4, 5);
            var clone = grid.clone();
            clone.width.should.equal(4);
            clone.height.should.equal(5);
        });

        it('should preserve walkability of every node', function() {
            var matrix = [
                [0, 1, 0],
                [1, 0, 1],
                [0, 0, 0],
            ];
            var grid = new Grid(matrix);
            var clone = grid.clone();
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 3; x++) {
                    clone.isWalkableAt(x, y).should.equal(grid.isWalkableAt(x, y));
                }
            }
        });

        it('should be independent from original (mutate clone, original unchanged)', function() {
            var grid = new Grid(3, 3);
            var clone = grid.clone();
            clone.setWalkableAt(1, 1, false);
            grid.isWalkableAt(1, 1).should.be.true;
        });

        it('should be independent from original (mutate original, clone unchanged)', function() {
            var grid = new Grid(3, 3);
            var clone = grid.clone();
            grid.setWalkableAt(0, 0, false);
            clone.isWalkableAt(0, 0).should.be.true;
        });
    });

    describe('_buildNodes matrix size mismatch', function() {
        it('should throw when matrix rows do not match height', function() {
            (function() { new Grid(5, 5, [[0,0,0]]); }).should.throw('Matrix size does not fit');
        });

        it('should throw when matrix cols do not match width', function() {
            (function() { new Grid(5, 5, [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]]); })
                .should.throw('Matrix size does not fit');
        });
    });

    describe('getNodeAt', function() {
        it('should return node with matching x and y', function() {
            var grid = new Grid(4, 4);
            var node = grid.getNodeAt(2, 3);
            node.x.should.equal(2);
            node.y.should.equal(3);
        });
    });

    describe('getNeighbors with DiagonalMovement.Always', function() {
        it('should return diagonal neighbor even when adjacent cardinals blocked', function() {
            // 3x3 grid, center node (1,1), block up (1,0) and left (0,1)
            // diagonal (0,0) should still be returned with Always
            var grid = new Grid(3, 3);
            grid.setWalkableAt(1, 0, false); // up blocked
            grid.setWalkableAt(0, 1, false); // left blocked
            var node = grid.getNodeAt(1, 1);
            var neighbors = grid.getNeighbors(node, DiagonalMovement.Always);
            // should include (0,0) diagonal even though both adjacent cardinals blocked
            var hasTopLeft = neighbors.some(function(n) { return n.x === 0 && n.y === 0; });
            hasTopLeft.should.be.true;
        });

        it('should return all 8 walkable neighbors when none blocked', function() {
            var grid = new Grid(3, 3);
            var node = grid.getNodeAt(1, 1);
            var neighbors = grid.getNeighbors(node, DiagonalMovement.Always);
            neighbors.length.should.equal(8);
        });
    });

    describe('getNeighbors with DiagonalMovement.OnlyWhenNoObstacles', function() {
        it('should return diagonal only when both adjacent cardinals walkable', function() {
            var grid = new Grid(3, 3);
            var node = grid.getNodeAt(1, 1);
            // all walkable — all 4 diagonals should appear
            var neighbors = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);
            neighbors.length.should.equal(8);
        });

        it('should NOT return diagonal when one adjacent cardinal is blocked', function() {
            var grid = new Grid(3, 3);
            grid.setWalkableAt(1, 0, false); // up blocked — d0 and d1 require s0
            var node = grid.getNodeAt(1, 1);
            var neighbors = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);
            // top-left (0,0) requires s3 && s0; top-right (2,0) requires s0 && s1
            var hasTopLeft = neighbors.some(function(n) { return n.x === 0 && n.y === 0; });
            var hasTopRight = neighbors.some(function(n) { return n.x === 2 && n.y === 0; });
            hasTopLeft.should.be.false;
            hasTopRight.should.be.false;
        });
    });

    describe('getNeighbors with invalid diagonalMovement', function() {
        it('should throw Incorrect value of diagonalMovement', function() {
            var grid = new Grid(3, 3);
            var node = grid.getNodeAt(1, 1);
            (function() { grid.getNeighbors(node, 999); }).should.throw('Incorrect value of diagonalMovement');
        });
    });

    describe('1x1 grid', function() {
        it('should return empty neighbors array for the single node', function() {
            var grid = new Grid(1, 1);
            var node = grid.getNodeAt(0, 0);
            grid.getNeighbors(node, DiagonalMovement.Never).should.eql([]);
            grid.getNeighbors(node, DiagonalMovement.Always).should.eql([]);
        });
    });

    describe('all-blocked grid with center walkable', function() {
        it('should return 0 cardinal neighbors for center node', function() {
            var grid = new Grid(3, 3);
            // block all except center
            for (var y = 0; y < 3; y++) {
                for (var x = 0; x < 3; x++) {
                    if (x !== 1 || y !== 1) grid.setWalkableAt(x, y, false);
                }
            }
            var node = grid.getNodeAt(1, 1);
            grid.getNeighbors(node, DiagonalMovement.Never).length.should.equal(0);
            grid.getNeighbors(node, DiagonalMovement.Always).length.should.equal(0);
        });
    });

    describe('setWalkableAt out-of-bounds', function() {
        it('should throw TypeError when coordinates are out of bounds', function() {
            var grid = new Grid(3, 3);
            (function() { grid.setWalkableAt(10, 10, false); }).should.throw(TypeError);
        });
    });
});
