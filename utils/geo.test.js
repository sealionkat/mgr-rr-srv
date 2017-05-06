/* global describe, it, require */
const expect = require('chai').expect;
const geo = require('./geo');

describe('geo utilis', () => {
  describe('intersectionDetection()', () => {
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

  describe('intersectionPoint()', () => {
    it('should return null', () => {
      expect(geo.intersectionPoint([0, 0, 1, 1], [2, 2, 3, 3])).to.be.equal(null);
    });

    it('should return array of coordinates', () => {
      expect(geo.intersectionPoint([0, 0, 2, 2], [0, 2, 2, 0])).to.deep.equal([1, 1]);
      expect(geo.intersectionPoint([0, 0, 1, 1], [0, 1, 1, 0])).to.deep.equal([0.5, 0.5]);
    });
  });

  describe('deg2rad()', () => {
    it('should return correct value', () => {
      expect(geo.deg2rad(90)).to.closeTo(Math.PI/2, 0.0001);
      expect(geo.deg2rad(180)).to.closeTo(Math.PI, 0.0001);
      expect(geo.deg2rad(45)).to.closeTo(Math.PI/4, 0.0001);
      expect(geo.deg2rad(30)).to.closeTo(Math.PI/6, 0.0001);
      expect(geo.deg2rad(60)).to.closeTo(Math.PI/3, 0.0001);
    });
  });

  describe('rad2deg()', () => {
    it('should return correct value', () => {
      expect(geo.rad2deg(Math.PI)).to.closeTo(180, 0.0001);
      expect(geo.rad2deg(Math.PI/2)).to.closeTo(90, 0.0001);
      expect(geo.rad2deg(Math.PI/4)).to.closeTo(45, 0.0001);
      expect(geo.rad2deg(Math.PI/6)).to.closeTo(30, 0.0001);
      expect(geo.rad2deg(Math.PI/3)).to.closeTo(60, 0.0001);
    });
  });

  describe('computeSecondArcPoint()', () => {
    // todo
  });
});
