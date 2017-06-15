const {RECEIVED_MESSAGES, SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');
const RL = require('../node_modules/reinforcejs/lib/rl');
const RlEnv = require('./rlEnv');

class RlBot extends Bot {
  constructor() {
    super();

    this.pressedKey = null;
    this.rlEnv = new RlEnv();
    this.agent = new RL.DQNAgent(this.rlEnv.env, this.rlEnv.spec);
    this.lastReward = null;
    this.lastAction = null;
    this.rewards = [];
    this.actions = [];
    this.lastSensorsFeedback = null;

    super.sayHello('Reinforcement Learning Bot');
  }

  updateReward(reward) {
    this.lastReward = reward;
    this.rewards.push(reward);
  }

  updateAction(action) {
    this.lastAction = action;
    this.actions.push(action);
  }

  analyze(receivedMessage, data) {
    const reward = this.rlEnv.computeReward(this.lastSensorsFeedback, data.playerPos);
    this.updateReward(reward);
    this.agent.learn(reward);

    const sensorsFeedback = this.rlEnv.performEnvironmentActions(data);
    this.lastSensorsFeedback = sensorsFeedback;
    const action = this.agent.act(sensorsFeedback);
    this.updateAction(action);
    console.log('show action', action);
    /*
    0 - noop
    1 - left
    2 - right
     */
    switch (action) {
      case 0:
        return SENT_MESSAGES.RELEASEARROWKEY;
      case 1:
        return SENT_MESSAGES.MOVELEFT;
      case 2:
        return SENT_MESSAGES.MOVERIGHT;
      default:
        return SENT_MESSAGES.GETGAMESTATE;
    }
  }

  firstStepMessage(data) {
    console.warn('first step message', data);
    /* first action is noop and reward for this action is 0 */
    this.rlEnv.computeSensors(data.playerPos);

    const sensorsFeedback = this.rlEnv.performEnvironmentActions(data);
    const action = this.agent.act(sensorsFeedback);
    this.lastSensorsFeedback = sensorsFeedback;
    this.updateAction(action);

    return SENT_MESSAGES.GETGAMESTATE;
  }

  gameOver() {
    const reward = -100;
    this.updateReward(reward);
    this.agent.learn(reward);
  }

  exportData() {

  }

  importData() {

  }
}

module.exports = RlBot;
