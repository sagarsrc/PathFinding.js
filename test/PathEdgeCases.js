var PF = require('..');

/**
 * Edge-case scenarios that can't live in PathTestScenarios.js because
 * PathTest.js unconditionally accesses path[0]/path[last], which throws
 * when the result is an empty array (no-path, some start==end finders).
 */

var allFinders = [
    { name: 'AStarFinder',               finder: new PF.AStarFinder() },
    { name: 'BreadthFirstFinder',        finder: new PF.BreadthFirstFinder() },
    { name: 'DijkstraFinder',            finder: new PF.DijkstraFinder() },
    { name: 'BiBreadthFirstFinder',      finder: new PF.BiBreadthFirstFinder() },
    { name: 'BiDijkstraFinder',          finder: new PF.BiDijkstraFinder() },
    { name: 'BiAStarFinder',             finder: new PF.BiAStarFinder() },
    { name: 'BestFirstFinder',           finder: new PF.BestFirstFinder() },
    { name: 'BiBestFirstFinder',         finder: new PF.BiBestFirstFinder() },
    { name: 'IDAStarFinder',             finder: new PF.IDAStarFinder() },
    { name: 'JPF-IfAtMostOneObstacle',   finder: new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle }) },
    { name: 'JPF-NeverDiagonal',         finder: new PF.JumpPointFinder({ diagonalMovement: PF.DiagonalMovement.Never }) },
];

describe('Path edge cases', function () {

    describe('no-path: start fully enclosed by walls', function () {
        // 3×3 grid, (1,1) is start and is completely surrounded by walls
        var matrix = [
            [1, 1, 1],
            [1, 0, 1],
            [1, 1, 1]
        ];

        allFinders.forEach(function (f) {
            it(f.name + ' returns empty path', function () {
                var grid = new PF.Grid(matrix);
                var path = f.finder.findPath(1, 1, 0, 0, grid);
                path.length.should.equal(0);
            });
        });
    });

    describe('start === end (1×1 grid)', function () {
        // When start equals end, path should be either [[x,y]] or []
        // Finders differ: some return [[0,0]], others return [].
        // Both are acceptable; what must NOT happen is an exception.

        allFinders.forEach(function (f) {
            it(f.name + ' does not throw', function () {
                var grid = new PF.Grid(1, 1);
                var path = f.finder.findPath(0, 0, 0, 0, grid);
                // result is [] or [[0,0]] — either is valid
                (path.length === 0 || (path.length === 1 && path[0][0] === 0 && path[0][1] === 0)).should.be.true();
            });
        });
    });

    describe('start === end (larger grid, mid-point)', function () {
        allFinders.forEach(function (f) {
            it(f.name + ' does not throw and start/end are correct if path non-empty', function () {
                var grid = new PF.Grid(5, 5);
                var path = f.finder.findPath(2, 2, 2, 2, grid);
                if (path.length > 0) {
                    path[0].should.eql([2, 2]);
                    path[path.length - 1].should.eql([2, 2]);
                }
                // empty path is also acceptable
                (path.length >= 0).should.be.true();
            });
        });
    });

});
