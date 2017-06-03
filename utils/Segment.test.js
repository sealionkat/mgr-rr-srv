/* global describe, it, require */
const Point = require('./Point');
const Segment = require('./Segment');
const expect = require('chai').expect;

describe('Segment', () => {
  describe('constructor()', () => {
    it('should throw error when passed arguments with wrong types', () => {
      expect(() => new Segment(0, 0)).to.throw(TypeError);
      expect(() => new Segment(new Point(0, 0), 0)).to.throw(TypeError);
      expect(() => new Segment(0, new Point(0, 0))).to.throw(TypeError);
    });

    it('should create correct object', () => {
      expect(new Segment(new Point(0, 0), new Point(1, 1))).to.deep.equal({
        p1: {
          x: 0,
          y: 0
        },
        p2: {
          x: 1,
          y: 1
        }
      });
    });
  });

  describe('length()', () => {
    it('should return correct length value of segment', () => {
      const s = new Segment(new Point(0, 0), new Point(2, 0));

      expect(s.length).to.be.equal(2);
    });
  });

  describe('findIntersectionPoint()', () => {
    it('should return Point with correct coords', () => {
      const s1 = new Segment(new Point(0, 0), new Point(1, 1));
      const s2 = new Segment(new Point(0, 1), new Point(1, 0));

      expect(s1.findIntersectionPoint(s2)).to.be.deep.equal(new Point(0.5, 0.5));
    });

    it('should return null', () => {
      const s1 = new Segment(new Point(0, 0), new Point(1, 0));
      const s2 = new Segment(new Point(1, 1), new Point(2, 2));

      expect(s1.findIntersectionPoint(s2)).to.be.equal(null);
    });
  });

  describe('toString()', () => {
    it('should return string with segment points', () => {
      const s = new Segment(new Point(0, 1), new Point(2, 3));

      expect(s.toString()).to.be.equal('(0, 1), (2, 3)');
    });
  });

  describe('toArray()', () => {
    it('should return array with flatten coords', () => {
      const s = new Segment(new Point(0, 1), new Point(2, 3));

      expect(s.toArray()).to.be.deep.equal([0, 1, 2, 3]);
    });

    it('should return array of points', () => {
      const s = new Segment(new Point(0, 1), new Point(2, 3));

      expect(s.toArray(true)).to.be.deep.equal([[0, 1], [2, 3]]);
    });
  });
});
