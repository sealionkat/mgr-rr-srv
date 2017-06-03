/* global describe, it, require */
const Point = require('./Point');
const expect = require('chai').expect;

describe('Point class', () => {
  describe('distanceFromPoint()', () => {
    it('should return distance from point', () => {
      const p = new Point(0, 0);

      expect(p.distanceFromPoint(new Point(0, 1))).to.be.equal(1);
      expect(p.distanceFromPoint(new Point(1, 0))).to.be.equal(1);
      expect(p.distanceFromPoint(new Point(1, 1))).to.be.within(1.414, 1.415);
    });
  });

  describe('distanceFromPoint2()', () => {
    it('should return squared distance from point', () => {
      const p = new Point(0, 0);

      expect(p.distanceFromPoint2(new Point(0, 1))).to.be.equal(1);
      expect(p.distanceFromPoint2(new Point(1, 0))).to.be.equal(1);
      expect(p.distanceFromPoint2(new Point(1, 1))).to.be.closeTo(2, 0.001);
    });
  });

  describe('toString()', () => {
    it('should return string with point coords', () => {
      const p = new Point(0, 0);

      expect(p.toString()).to.match(/(0, 0)/);
    });
  });
});
