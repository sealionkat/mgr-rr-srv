/* global describe, it */
const expect = require('chai').expect;

const RlEnv = require('./rlEnv');
const Point = require('../utils/Point');

describe('rlEnv', () => {
  const expectedSensorConfig = {
    count: 35,
    dimensionality: 5,
    len: 100
  };

  describe('constructor()', () => {
    it('should create proper object', () => {
      const r = new RlEnv();
      const {env, sensorsConfig} = r;

      expect(sensorsConfig).to.be.deep.equal(expectedSensorConfig);
      expect(env.getMaxNumActions()).to.be.equal(3);
      expect(env.getNumStates()).to.be.equal(expectedSensorConfig.count * expectedSensorConfig.dimensionality + 3);
    });
  });

  describe('computeSensors()', () => {
    it('should contain correct sensors array', () => {
      const r = new RlEnv();
      r.computeSensors(new Point(0, 0));
      const sensors = r.sensors;

      expect(sensors).to.have.length(expectedSensorConfig.count);
      expect(sensors[0]).to.deep.equal(new Point(-100, 0));
      expect(sensors[expectedSensorConfig.count - 1]).to.deep.equal(new Point(100, 0));
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

  describe('computeSensorFeedback()', () => {
    it('should return correct feedback when no data on sensors', () => {
      const r = new RlEnv({count: 17, len: 100, dimensionality: 5});
      const gameObjects = [{
        pos: {
          x: 500,
          y: 501
        }
      }, {
        pos : {
          x: 1000,
          y: 50
        }
      }, {
        pos: {
          x: 500,
          y: 500
        }
      }];

      r.computeSensors(new Point(0, 0));
      const filteredObjects = r.filterNearestObjects(new Point(0, 0), gameObjects);
      const feedback = r.computeSensorFeedback(new Point(0, 0), filteredObjects, 0);

      expect(feedback).to.deep.equal([
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        1, 1, -1, 0, 0,
        0,
        0,
        0
      ]);


    });
  });
});
