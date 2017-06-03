/* global require */
const geo = require('../utils/geo');


class RlEnv {
  constructor() {
    this.sensorsConfig = {
      count: 17,
      len: 100,
      dimensionality: 5
    };
    this.sensors = [];
// agent parameter spec to play with (this gets eval()'d on Agent reset)
    const spec = {};
    spec.update = 'qlearn'; // qlearn | sarsa
    spec.gamma = 0.9; // discount factor, [0, 1)
    spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
    spec.alpha = 0.01; // value function learning rate
    spec.experience_add_every = 10; // number of time steps before we add another experience to replay memory
    spec.experience_size = 5000; // size of experience replay memory
    spec.learning_steps_per_iteration = 20;
    spec.tderror_clamp = 1.0; // for robustness
    spec.num_hidden_units = 100; // number of neurons in hidden layer
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

  convertData2Array(data) {
    return [];
  }

  computeSensors(playerPos) {
    const sensorsConfig = this.sensorsConfig;
    const sensors = [];
    const sectorsCount = sensorsConfig.count - 1;
    const sectorAngle = 180 / sectorsCount;
    const x = playerPos.x;
    const y = playerPos.y;
    let alpha = 0;

    for(let i = 0; i <= sectorsCount; ++i, alpha += sectorAngle) {
      const result = geo.computeSecondArcPoint(x, y, alpha, sensorsConfig.len);
      sensors.push(result);
    }

    this.sensors = sensors;
  }

  computeReward(data) {
    

    return 0;
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
    const {x, y} = playerPos;

    sensors.forEach(sensor => {
      let minDistance = Number.MAX_SAFE_INTEGER; // search for nearest object
      let nearestObject;

      objects.forEach(item => {
        const vertices = geo.findRectVertices(item.pos.x, item.pos.y, item.width, item.height);

        let intersectionPoint = geo.intersectionPoint([sensor[0], sensor[1], x, y], [vertices[0][0], vertices[0][1], vertices[1][0], vertices[1][1]]);

      });

    });
  }

  performEnvironmentActions(data) {
    return this.convertData2Array({});
  }
}

module.exports = RlEnv;
