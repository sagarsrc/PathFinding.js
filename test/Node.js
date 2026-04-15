var PF = require('..');
var Node = PF.Node;

describe('Node', function() {
    it('should default walkable to true when not specified', function() {
        var node = new Node(2, 3);
        node.walkable.should.be.true;
    });

    it('should set walkable to false when passed false', function() {
        var node = new Node(2, 3, false);
        node.walkable.should.be.false;
    });

    it('should default walkable to true when undefined passed', function() {
        var node = new Node(2, 3, undefined);
        node.walkable.should.be.true;
    });

    it('should set x and y coordinates correctly', function() {
        var node = new Node(2, 3);
        node.x.should.equal(2);
        node.y.should.equal(3);
    });
});
