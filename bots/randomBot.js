const {RECEIVED_MESSAGES, SENT_MESSAGES} = require('../messagesTypes');
const Bot = require('./bot');


class RandomBot extends Bot {
  constructor() {
    super();

    this.pressedKey = null;
    super.sayHello('RandomBot');
  }

  analyze(receivedMessage, data) {
    switch (receivedMessage) {
      case RECEIVED_MESSAGES.PRESSEDLEFTKEY:
      case RECEIVED_MESSAGES.PRESSEDRIGHTKEY:
        this.pressedKey = receivedMessage;

        return SENT_MESSAGES.GETPLAYERPOS;
      case RECEIVED_MESSAGES.RELEASEDLEFTKEY:
      case RECEIVED_MESSAGES.RELEASEDRIGHTKEY:
        this.pressedKey = null;

        return SENT_MESSAGES.GETPLAYERPOS;
      case RECEIVED_MESSAGES.PLAYERPOS:
        if(data.x <= 30 && this.pressedKey !== null) {
          return SENT_MESSAGES.RELEASELEFT;
        } else if(data.x <= 30 && this.pressedKey === null) {
          return SENT_MESSAGES.MOVERIGHT;
        } else if(data.x >= 418 && this.pressedKey !== null) {
          return SENT_MESSAGES.RELEASERIGHT;
        } else if(data.x >= 418 && this.pressedKey === null) {
          return SENT_MESSAGES.MOVELEFT;
        }

        return SENT_MESSAGES.GETPLAYERPOS;
      case RECEIVED_MESSAGES.GAMESTATE:
        return SENT_MESSAGES.MOVELEFT;
      default:
        console.log('unknown or unimplemented action', receivedMessage);
    }

    return SENT_MESSAGES.GETPLAYERPOS;
  }

  firstStepMessage() {
    return SENT_MESSAGES.GETGAMESTATE;
  }
}

module.exports = RandomBot;
