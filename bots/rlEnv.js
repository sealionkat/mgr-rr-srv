/* global require */
const geo = require('../utils/geo');
const Point = require('../utils/Point');
const Segment = require('../utils/Segment');
const MathExp = require('../utils/MathExp');

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

const normalizePosX = MathExp.normalizeCurried(450, 30);
const normalizePosY = MathExp.normalizeCurried(800, 0);
const normalizeVec = MathExp.normalizeCurried(-1, 1);

const normalizeSensorDistance = MathExp.normalizeCurried(100, 0);

class RlEnv {
  constructor(config) {
    this.sensorsConfig = config ? config : {
      count: 35,
      len: 100,
      dimensionality: 5
    };
    this.sensors = []; // array of Point
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
    this.computeReward = this.computeReward.bind(this);
    this.filterNearestObjects = this.filterNearestObjects.bind(this);
    this.computeSensorFeedback = this.computeSensorFeedback.bind(this);
  }

  computeSensors(playerPos) {
    const sensorsConfig = this.sensorsConfig;
    const sensors = [];
    const sectorsCount = sensorsConfig.count - 1;
    const sectorAngle = 180 / sectorsCount;
    const {x, y} = playerPos;
    let alpha = 0;

    for(let i = 0; i <= sectorsCount; ++i, alpha = i * sectorAngle) {
      const result = new Point(geo.computeSecondArcPoint(x, y, alpha, sensorsConfig.len));
      sensors.push(result);
    }

    this.sensors = sensors;
  }

  computeReward(sensorsFeedback, playerPos) {
    let reward = 0;
    const playerPosPoint = new Point(playerPos.x, playerPos.y);
    const sensorLength = this.sensorsConfig.len;
    const dimensionality = this.sensorsConfig.dimensionality;

    for(let i = 0; i < sensorsFeedback.length - 3; i += dimensionality) {
      const point = new Point(sensorsFeedback[i], sensorsFeedback[i + 1]);
      const distance = playerPosPoint.distanceFromPoint(point);
      const ratio = distance / sensorLength;
      const reversedRatio = 1 - ratio;

      if (sensorsFeedback[i + 2] === 1) { // bad
        reward -= reversedRatio * reversedRatio;
      } else if(sensorsFeedback[i + 2] === 0) { // good
        reward += 100 * (reversedRatio * reversedRatio);
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

  findIntersectionWithEdge(sensorSegment, leftEdge, rightEdge) {
    let intersectionPoint = null;

    return intersectionPoint;
  }

  computeSensorFeedback(playerPos, gameObjects, playerVel, leftEdge, rightEdge) {
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
      TODO: test with parameters:
      - vx, vy of observed object (2 fields)
      - for each type of object (good/bad/rest) should be set normalized distance from Player; if clean - set 1.0
      */

      /*
      - range (x, y)
       - type {0, 1, 2}, 0 - good, 1 - bad, 2 - wall/edge/bank
       - velocity (vx, vy)
       */
      if (nearestObject !== null) {
        let goodDistance = 1.0;
        let badDistance = 1.0;
        let wallDistance = 1.0;
        const objectType = nearestObject.type;

        if (objectType.localeCompare('enemy') || objectType.localeCompare('bulletE')) { // bad item
          badDistance = normalizeSensorDistance(minDistance);
        } else { // good item
          goodDistance = normalizeSensorDistance(minDistance);
        }

        sensorsFeedback.push(
          goodDistance,
          badDistance,
          wallDistance,
          nearestObject.vel.x,
          nearestObject.vel.y
        );
      } else {
        sensorsFeedback.push(
          1.0,
          1.0,
          1.0,
          0,
          0
        );
      }
    });

    sensorsFeedback.push(normalizePosX(playerPos.x), normalizePosY(playerPos.y), normalizeVec(playerVel));

    return sensorsFeedback;
  }

  performEnvironmentActions(data, leftEdge, rightEdge) {


    return this.computeSensorFeedback(data.playerPos, data.gameObjects, data.playerVel, leftEdge, rightEdge);
  }
}

module.exports = RlEnv;
