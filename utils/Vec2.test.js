/* global describe, it, require */
const Vec2 = require('./Vec2');
const expect = require('chai').expect;

describe('Vec2', () => {
  describe('constructor()', () => {

  });

  describe('coords()', () => {
    it('should return correct vector coords', () => {
      const v = new Vec2(0, 1);

      expect(v.coords).to.deep.equal({
        x: 0,
        y: 1
      });
    });
  });

  describe('length()', () => {
    it('should return correct vector length', () => {
      const v = new Vec2(1, 1);
      expect(v.length).closeTo(Math.sqrt(2), 0.001);
    });
  });

  describe('distance()', () => {
    it('should return correct distance from vector', () => {

      expect(true).equal(false);
    });
  });

  describe('distance2()', () => {
    it('should return correct square distance from vector', () => {

      expect(true).equal(false);
    });
  });

  describe('add()', () => {
    it('should add vector', () => {
      const v = new Vec2(2, 3);

      v.add(new Vec2(1, 5));

      expect(v.coords).to.deep.equal({
        x: 3,
        y: 8
      });
    });
  });

  describe('sub()', () => {
    it('should subtract vector', () => {
      const v = new Vec2(2, 3);

      v.sub(new Vec2(1, 5));

      expect(v.coords).to.deep.equal({
        x: 1,
        y: -2
      });
    });
  });

  describe('scale()', () => {
    it('should scale vector', () => {
      const v = new Vec2(2, 3);

      v.scale(2.5);

      expect(v.coords).to.deep.equal({
        x: 5,
        y: 7.5
      });
    });
  });
});
