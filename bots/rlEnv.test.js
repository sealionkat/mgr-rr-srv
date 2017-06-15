/* global describe, it */
const expect = require('chai').expect;

const RlEnv = require('./rlEnv');
const Point = require('../utils/Point');

describe('rlEnv', () => {
  describe('constructor()', () => {
    it('should create proper object', () => {
      const r = new RlEnv();
      const {env, sensorsConfig} = r;

      expect(sensorsConfig).to.be.deep.equal({
        count: 17,
        dimensionality: 5,
        len: 100
      });
      expect(env.getMaxNumActions()).to.be.equal(3);
      expect(env.getNumStates()).to.be.equal(88);
    });
  });

  describe('computeSensors()', () => {
    it('should contain correct sensors array', () => {
      const r = new RlEnv();
      r.computeSensors(new Point(0, 0));
      const sensors = r.sensors;

      expect(sensors).to.have.length(17);
      expect(sensors[0]).to.deep.equal(new Point(-100, 0));
      expect(sensors[16]).to.deep.equal(new Point(100, 0));
    });
  });

  describe('filterNearestObjects()', () => {
    it('should return filtered objects', () => {
      const r = new RlEnv();
      const gameObjects = [{
        pos: {
          x: 0,
          y: 1
        }
      }, {
        pos : {
          x: 100,
          y: 0
        }
      }, {
        pos: {
          x: 200,
          y: 300
        }
      }];
      r.computeSensors(new Point(0, 0));
      const filteredObjects = r.filterNearestObjects(new Point(0, 0), gameObjects);


      expect(filteredObjects).to.deep.equal([{
        pos: {
          x: 0,
          y: 1
        }
      }, {
        pos : {
          x: 100,
          y: 0
        }
      }]);
    });
  });
});
