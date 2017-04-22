const expect = require('chai').expect;
const geo = require('./geo');

describe('geo utilis', () => {
  describe('intersectionDetection()', () => {
    it('should return false', () => {
      expect(geo.intersectionDetect()).to.equal(false);
    });
  })
});
