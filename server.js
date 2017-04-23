const WebSocketServer = require('websocket').server;
const http = require('http');
const RandomBot = require('./bots/randomBot');
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
  let bot = null;
  let gameover = false;
  console.log((new Date()) + ' Connection accepted.');

  connection.on('message', function(message) {
    console.log('message', message);

    if (message.type === 'utf8') {
      const data = JSON.parse(message.utf8Data);
      let timeoutId = null;

      switch (data.type) {
        case RECEIVED_MESSAGES.HANDSHAKE:
          console.log('handshake!');
          connection.sendUTF(SENT_MESSAGES.WHICHBOT);
          break;
        case RECEIVED_MESSAGES.BOT:
          console.log('bot!', data.data);
          //bot = new RandomBot();
          switch(data.data) {
            case 'random':
              bot = new RandomBot();
              break;
            case 'rl':
              console.log('rl')
              bot = new RlBot();
              break;
            case 'rlc':
              // todo: use existing rlbot or create new
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
              connection.sendUTF(bot.firstStepMessage());
            }, CONFIG.TIMEOUT);
          }
          break;
        case RECEIVED_MESSAGES.GAMESTATE:
        case RECEIVED_MESSAGES.PRESSEDLEFTKEY:
        case RECEIVED_MESSAGES.PLAYERPOS:
        case RECEIVED_MESSAGES.PRESSEDRIGHTKEY:
        case RECEIVED_MESSAGES.RELEASEDLEFTKEY:
        case RECEIVED_MESSAGES.RELEASEDRIGHTKEY:
          if(!gameover) {
            timeoutId = setTimeout(() => {
              connection.sendUTF(bot.analyze(data.type, data.data));
            }, CONFIG.TIMEOUT);
          }
          break;
        case RECEIVED_MESSAGES.GAMEOVER:
          clearTimeout(timeoutId);
          gameover = true;
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
