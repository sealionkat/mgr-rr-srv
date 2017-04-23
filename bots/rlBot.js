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
    - type {0, 1}
    - velocity (vx, vy)
    + velocity of player {-1, 0, 1}
     */
  }

  analyze(receivedMessage, data) {
    /*
     var action = agent.act(s); // s is an array of length 8
     //... execute action in environment and get the reward
     agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float
     */
    return SENT_MESSAGES.GETGAMESTATE;
  }

  firstStepMessage() {
    return SENT_MESSAGES.GETGAMESTATE;
  }
  exportData() {

  }

  importData() {

  }


}

module.exports = RlBot;
