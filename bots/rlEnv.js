/* global require */
const geo = require('../utils/geo');
const Point = require('../utils/Point');
const Segment = require('../utils/Segment');

const defaultSpec = {
  update: 'qlearn', // qlearn | sarsa
  gamma: 0.9, // discount factor, [0, 1)
  epsilon: 0.2, // initial epsilon for epsilon-greedy policy, [0, 1)
  alpha: 0.01, // value function learning rate
  experience_add_every: 10, // number of time steps before we add another experience to replay memory
  experience_size: 5000, // size of experience replay memory
  learning_steps_per_iteration: 20,
  tderror_clamp: 1.0, // for robustness
  num_hidden_units: 100 // number of neurons in hidden layer
};

class RlEnv {
  constructor() {
    this.sensorsConfig = {
      count: 17,
      len: 100,
      dimensionality: 5
    };
    this.sensors = []; // array of Point
// agent parameter spec to play with (this gets eval()'d on Agent reset)
    const spec = defaultSpec;
    const env = {};
    /*
    we need sensor data and player pos (x, y) and it's velocity (vx)
     */
    env.getNumStates = () => this.sensorsConfig.count * this.sensorsConfig.dimensionality + 3;
    /*
    0 - noop/stop
    1 - left
    2 - right
     */
    env.getMaxNumActions = () => 3;

    this.spec = spec;
    this.env = env;
    this.computeSensors = this.computeSensors.bind(this);
  }

  computeSensors(playerPos) {
    const sensorsConfig = this.sensorsConfig;
    const sensors = [];
    const sectorsCount = sensorsConfig.count - 1;
    const sectorAngle = 180 / sectorsCount;
    const {x, y} = playerPos;
    let alpha = 0;

    for(let i = 0; i <= sectorsCount; ++i, alpha += sectorAngle) {
      const result = new Point(geo.computeSecondArcPoint(x, y, alpha, sensorsConfig.len));
      sensors.push(result);
    }

    this.sensors = sensors;
  }

  computeReward(sensorsFeedback, playerPos) {
    let reward = 0;
    const playerPosPoint = new Point(playerPos.x, playerPos.y);
    const sensorLength = this.sensorsConfig.len;
    const sensorDimensionality = this.sensorsConfig.dimensionality;

    for(let i = 0; i < sensorsFeedback.length; i += sensorDimensionality) {
      const distance = playerPosPoint.distanceFromPoint(sensorsFeedback[i], sensorsFeedback[i + 1]);
      const ratio = distance / sensorLength;

      if (sensorsFeedback[i + 2] === 1) { // bad
        reward -= 1 - ratio;
      } else { // good
        reward += 100 * (1 - ratio);
      }
    } 

    return reward;
  }

  filterNearestObjects(playerPos, gameObjects) {
    const radius = this.sensorsConfig.len;

    return gameObjects.filter(item => {
      return geo.isInCircle(playerPos.x, playerPos.y, radius, item.pos.x, item.pos.y);
    });
  }

  computeSensorFeedback(playerPos, gameObjects) {
    const sensors = this.sensors;
    const objects = this.filterNearestObjects(playerPos, gameObjects);
    const sensorsFeedback = [];
    const playerPosPoint = new Point(playerPos.x, playerPos.y);

    sensors.forEach(sensor => {
      let minDistance = Number.MAX_SAFE_INTEGER; // search for nearest object;
      let nearestObject = null;
      const sensorSegment = new Segment(playerPosPoint, sensor);

      objects.forEach(item => {
        const vertices = Point
          .coordsArray2PointsArray(
            geo.findRectVertices(item.pos.x, item.pos.y, item.width, item.height)
          );

        const itemSegment1 = new Segment(vertices[0], vertices[1]);
        const itemSegment2 = new Segment(vertices[1], vertices[2]);
        const itemSegment3 = new Segment(vertices[2], vertices[3]);
        const itemSegment4 = new Segment(vertices[3], vertices[0]);

        const segments = [itemSegment1, itemSegment2, itemSegment3, itemSegment4];

        segments.forEach(segment => {
          const intersectionPoint = sensorSegment.findIntersectionPoint(segment);

          if (intersectionPoint !== null) {
            const distance = playerPosPoint.distanceFromPoint(intersectionPoint);

            if (distance < minDistance) {
              minDistance = distance;
              nearestObject = item;
            }
          }
        });
      });

      /*
      - range (x, y)
       - type {0, 1}, 0 - good, 1 - bad
       - velocity (vx, vy)
       */
      if (nearestObject !== null) {
        sensorsFeedback.push([
          nearestObject.pos.x,
          nearestObject.pos.y,
          nearestObject.localeCompare('enemy') ? 1 : 0,
          nearestObject.vel.x,
          nearestObject.vel.y
        ]);
      } else { // what to do if sensor is clean?

      }
    });

    return sensorsFeedback;
  }

  performEnvironmentActions(data) {
    const sensorsFeedback = this.computeSensorFeedback(data.playerPos, data.gameObjects);

    return sensorsFeedback;
  }
}

module.exports = RlEnv;
