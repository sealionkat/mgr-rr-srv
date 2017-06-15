const WebSocketServer = require('websocket').server;
const http = require('http');
const SimpleBot = require('./bots/simpleBot');
const RlBot = require('./bots/rlBot');
const {RECEIVED_MESSAGES, SENT_MESSAGES} = require('./messagesTypes');
const CONFIG = require('./config');


const server = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(CONFIG.PORT, function() {
  console.log((new Date()) + ' Server is listening on port 8081');
});

wsServer = new WebSocketServer({
  httpServer: server,
  autoAcceptConnections: false,
  maxReceivedFrameSize: CONFIG.MAXFRAMESIZE
});

let connection = null;
let bot = null;

function originIsAllowed(origin) {
  return true;
}

wsServer.on('request', function(request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');

    return;
  }

  connection = request.accept('echo-protocol', request.origin);
  let gameover = false;
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    console.log('message', message);

    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      let timeoutId = null;

      switch (data.type) {
        case RECEIVED_MESSAGES.REPLAY:
          console.log('replay!');
          gameover = false;
          connection.sendUTF(SENT_MESSAGES.HANDSHAKE);
          break;
        case RECEIVED_MESSAGES.HANDSHAKE:
          console.log('handshake!');
          connection.sendUTF(SENT_MESSAGES.WHICHBOT);
          break;
        case RECEIVED_MESSAGES.BOT:
          console.log('bot!', data.data);
          switch(data.data) {
            case 'random':
              console.log('Simple bot');
              bot = new SimpleBot();
              break;
            case 'rl':
              console.log('Reinforcement Learning bot');
              bot = new RlBot();
              break;
            case 'rlc':
              console.log('Reinforcement Learning bot - learning mode')
              // todo: use existing rlbot or create new
              if (bot === null) {
                console.log('creating new bot')
                bot = new RlBot();
              } else {
                console.log('bot was created earlier');
              }
              break;
            default:
              console.log('unknown bot', data.data);
          }
          connection.sendUTF(SENT_MESSAGES.BOTCREATED);
          break;
        case RECEIVED_MESSAGES.IDLE:
          console.log('idle', data.data);
          if(!gameover) {
            timeoutId = setTimeout(() => {
              connection.sendUTF(bot.firstStepMessage(data.data));
            }, CONFIG.TIMEOUT);
          }
          break;
        case RECEIVED_MESSAGES.GAMESTATE:
        case RECEIVED_MESSAGES.PRESSEDLEFTKEY:
        case RECEIVED_MESSAGES.PLAYERPOS:
        case RECEIVED_MESSAGES.PRESSEDRIGHTKEY:
        case RECEIVED_MESSAGES.RELEASEDLEFTKEY:
        case RECEIVED_MESSAGES.RELEASEDRIGHTKEY:
        case RECEIVED_MESSAGES.RELEASEDARROWKEY:
          console.log('Multimessage', data.type);
          if(!gameover) {
            timeoutId = setTimeout(() => {
              connection.sendUTF(bot.analyze(data.type, data.data));
            }, CONFIG.TIMEOUT);
          }
          break;
        case RECEIVED_MESSAGES.GAMEOVER:
          clearTimeout(timeoutId);
          gameover = true;
          bot.gameOver();
          console.log('gameover');
          break;
        default:
          console.warn('unknown action!', data.type);
      }
    } else { // binary data
      console.log('gameboard!');
      if(!gameover) {
        setTimeout(function () {
          connection.sendUTF(SENT_MESSAGES.GETBOARD);
        }, CONFIG.TIMEOUT);
      }
    }
  });

  if (connection.connected) {
    connection.sendUTF(SENT_MESSAGES.HANDSHAKE);
  }

  connection.on('close', function(reasonCode, description) {
    console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    console.log('Reason', reasonCode, ': ', description);
  });
});
