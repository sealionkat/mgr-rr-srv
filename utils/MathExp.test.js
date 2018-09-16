const expect = require('chai').expect;
const MathExp = require('./MathExp');

describe('Math expanded', () => {
  describe('normalize()', () => {
    const nm = {
      max: 100,
      min: 0
    };

    const nm2 = {
      max: 1,
      min: -1
    };

    it('should equal 0', () => {
      expect(MathExp.normalize(0, nm.max, nm.min)).to.be.equal(0);
      expect(MathExp.normalize(-1, nm2.max, nm2.min)).to.be.equal(0);
    });

    it('should equal 1', () => {
      expect(MathExp.normalize(100, nm.max, nm.min)).to.be.equal(1);
      expect(MathExp.normalize(1, nm2.max, nm2.min)).to.be.equal(1);
    });

    it('should equal 0.5', () => {
      expect(MathExp.normalize(50, nm.max, nm.min)).to.be.equal(0.5);
      expect(MathExp.normalize(0, nm2.max, nm2.min)).to.be.equal(0.5);
    });
  });
});
