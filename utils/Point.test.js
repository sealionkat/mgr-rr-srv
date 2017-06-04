/* global describe, it, require */
const Point = require('./Point');
const expect = require('chai').expect;

describe('Point class', () => {
  describe('constructor()', () => {
    it('should create Point from array of coords', () => {
      const p = new Point([0, 1]);

      expect(p.x).to.be.equal(0);
      expect(p.y).to.be.equal(1);
    });

    it('should create Point from numbers', () => {
      const p = new Point(0, 1);

      expect(p.x).to.be.equal(0);
      expect(p.y).to.be.equal(1);
    });
  });

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

  describe('toArray()', () => {
    it('should return an array with point coords', () => {
      const p = new Point(0, 1);

      expect(p.toArray()).to.deep.equal([0, 1]);
    });
  });
});
