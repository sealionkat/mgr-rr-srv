/* global describe, it, require */
const expect = require('chai').expect;
const geo = require('./geo');

describe('geo utilis', () => {
  describe('intersectionDetection()', () => {
    /*it('should throw error', () => {
      try {
        geo.intersectionDetect();
      } catch (err) {
        console.log('error', err);
        expect(err).to.be.an('error');
      }
    });*/
    it('should return false', () => {
      expect(geo.intersectionDetect([0, 0, 1, 1], [2, 2, 3, 3])).to.be.equal(false);
    });

    it('should return true', () => {
      expect(geo.intersectionDetect([0, 0, 0, 1], [-1, -0.5, 1, 0.5])).to.be.equal(true);
    });
  });

  describe('distance()', () => {
    it('should return correct value', () => {
      expect(geo.distance([0, 0], [0, 1])).to.be.equal(1);
      expect(geo.distance([0, 0], [1, 0])).to.be.equal(1);
      expect(geo.distance([0, 0], [1, 1])).to.be.within(1.414, 1.415);
    });
  });
});
