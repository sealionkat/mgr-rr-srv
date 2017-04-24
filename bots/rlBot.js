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

    super.sayHello('Reinforcement Learning Bot');
  }

  getBotConfig() {
    return {

    };
  }

  convertData2Array(data) {
    /*
    array structure:
    for each object
    - range (x, y)
    - type {0, 1}, 0 - good, 1 - bad
    - velocity (vx, vy)
    + velocity of player {-1, 0, 1}
     */
    const {playerPos, gameObjects, playerVel} = data;
    let arr = []; // length should be

    return arr;
  }

  analyze(receivedMessage, data) {
    this.agent.learn(this.rlEnv.computeReward(data));

    const action = this.agent.act(this.convertData2Array(data));
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
    /* first action is noop and reward for this action is 0 */
    this.rlEnv.computeSensors();

    const action = this.agent.act(this.rlEnv.performEnvironmentActions({}));

    return SENT_MESSAGES.GETGAMESTATE;
  }
  exportData() {

  }

  importData() {

  }


}

module.exports = RlBot;
