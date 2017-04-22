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
  })
});
