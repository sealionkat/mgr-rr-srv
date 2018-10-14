const {SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');
const RL = require('../node_modules/reinforcejs/lib/rl');
const RlEnv = require('./rlEnv');
const FM = require('../utils/fileManager');

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
    this.objects = [];
    this.lastSensorsFeedback = null;
    this.leftGroundPos = null;
    this.rightGroundPos = null;

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

  updateObjects(objects) {
    this.objects.push(objects);
  }

  analyze(receivedMessage, data) {
    const reward = this.rlEnv.computeReward(this.lastSensorsFeedback, data.playerPos);
    this.updateReward(reward);
    this.agent.learn(reward);

    const sensorsFeedback = this.rlEnv.performEnvironmentActions(data, 30, 450);
    this.lastSensorsFeedback = sensorsFeedback;
    const action = this.agent.act(sensorsFeedback);
    this.updateAction(action);
    this.updateObjects(data.gameObjects);
    //console.log('show action', action);
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
    // console.warn('first step message', data);
    this.actions = [];
    this.rewards = [];
    this.objects = [];
    this.rlEnv.computeSensors(data.playerPos);
    this.leftGroundPos = data.boardSizes[0] + data.groundWidth;
    this.rightGroundPos = data.boardSizes[2] - data.groundWidth;

    const sensorsFeedback = this.rlEnv.performEnvironmentActions(data, this.leftGroundPos, this.rightGroundPos);
    const action = this.agent.act(sensorsFeedback);
    this.lastSensorsFeedback = sensorsFeedback;
    this.updateAction(action);

    return SENT_MESSAGES.GETGAMESTATE;
  }

  gameOver(data) {
    const reward = -100;
    this.updateReward(reward);
    this.agent.learn(reward);
    this.exportData(data);
  }

  exportData(gameData) {
    FM.saveStats('RL', {
      actions: this.actions,
      rewards: this.rewards,
      //objects: this.objects,
      score: gameData.score,
      time: gameData.time,
      fuel: gameData.fuel,
      sensorsFeedback: this.lastSensorsFeedback
    });
    FM.saveAgentKnowledge(this.agent.toJSON());
  }

  importData() {

  }
}

module.exports = RlBot;
