const {RECEIVED_MESSAGES, SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');
const RL = require('../node_modules/reinforcejs/lib/rl');
const RlEnv = require('./rlEnv');

class RlBot extends Bot {
  constructor() {
    super();

    this.pressedKey = null;
    this.sensorsNo = 17;
    this.sensorLen = 100;
    this.sensorDimensionality = 5;
    this.rlEnv = new RlEnv();
    this.agent = new RL.DQNAgent(this.rlEnv.env, this.rlEnv.spec);

    this.sensors = [];
    super.sayHello('Reinforcement Learning Bot');
  }

  getBotConfig() {
    return {

    };
  }

  analyze() {

  }

  firstStepMessage() {

  }
  exportData() {

  }

  importData() {

  }

  computeSensorFeedback(gameObjects) {

  }
}

module.exports = RlBot;
