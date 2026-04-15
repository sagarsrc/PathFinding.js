var PF = require('..');
var Heuristic = PF.Heuristic;

describe('Heuristic', function() {
    describe('manhattan', function() {
        it('should return dx + dy', function() {
            Heuristic.manhattan(3, 4).should.equal(7);
        });

        it('should return 0 for (0, 0)', function() {
            Heuristic.manhattan(0, 0).should.equal(0);
        });
    });

    describe('euclidean', function() {
        it('should return sqrt(dx^2 + dy^2)', function() {
            Heuristic.euclidean(3, 4).should.equal(5);
        });

        it('should return 0 for (0, 0)', function() {
            Heuristic.euclidean(0, 0).should.equal(0);
        });
    });

    describe('octile', function() {
        var F = Math.SQRT2 - 1;

        it('should use F*dx+dy branch when dx < dy', function() {
            // dx=3, dy=4 → dx < dy → F*3 + 4
            Heuristic.octile(3, 4).should.equal(F * 3 + 4);
        });

        it('should use F*dy+dx branch when dx >= dy', function() {
            // dx=4, dy=3 → dx >= dy → F*3 + 4
            Heuristic.octile(4, 3).should.equal(F * 3 + 4);
        });

        it('should return 0 for (0, 0)', function() {
            Heuristic.octile(0, 0).should.equal(0);
        });
    });

    describe('chebyshev', function() {
        it('should return max(dx, dy)', function() {
            Heuristic.chebyshev(3, 4).should.equal(4);
        });

        it('should return 0 for (0, 0)', function() {
            Heuristic.chebyshev(0, 0).should.equal(0);
        });
    });
});
