const fs = require('fs');

const fileManager = {
  saveAgentKnowledge(knowledge) {
    fs.writeFile('agentknowledge', JSON.stringify(knowledge), err => {
      if (err) {
        console.error('Saving file error', err.code);

        return;
      }

      console.log('File saved');
    });
  },
  loadAgentKnowledge() {
    fs.readFile('agentknowledge', 'utf8', (err, data) => {
      if (err) {
        console.error('File read error', err.code);

        return;
      }

      console.log('Read data from file', data);

      return data;
    });
  },
  saveStats(botName, stats) {
    const timestamp = (new Date()).now();

    fs.writeFile(botName + timestamp, JSON.stringify(stats), err => {
      if (err) {
        console.error('Saving file error', err.code);

        return;
      }

      console.log('File saved');
    });

  },
  createDir(name) {
    fs.mkdir('./' + name, err => {
      if (err) {
        console.error('Creating dir error', err.code);

        return;
      }

      console.log('Directory', name, 'created');
    });
  }
};

module.exports = fileManager;
