const fs = require('fs');

const fileSystem = {
  readFile(name) {
    fs.readFile(name, 'utf8', (err, data) => {
      if (err) {
        console.error('File read error', err.code);

        return;
      }

      console.log('Read data from file', data);

      return data;
    });
  },
  writeFile(name, content) {
    fs.writeFile(name, JSON.stringify(content), err => {
      if (err) {
        console.error('Saving file error', err.code);

        return;
      }

      console.log('File saved');
    });
  },
  appendFile(name, content) {
    fs.appendFile(name, JSON.stringify(content), err => {
      if (err) {
        console.error('Appending file error', err.code);

        return;
      }

      console.log('File saved');
    });
  },
  createDir(path) {
    fs.mkdir('./' + path, err => {
      if (err) {
        console.error('Creating dir error', err.code);

        return;
      }

      console.log('Directory', path, 'created');
    });
  }
};

const fileManager = {
  saveAgentKnowledge(knowledge) {
    const timestamp = new Date();

    fileSystem.writeFile(`./knowledge/agent-knowledge-${timestamp}`, knowledge);
  },
  loadAgentKnowledge() {
    fileSystem.readFile('agent-knowledge');
  },
  saveStats(botName, stats) {
    const timestamp = new Date();

    fileSystem.writeFile(botName + timestamp, stats);
  },
  createDir(path) {
    fileSystem.createDir(path);
  }
};

module.exports = fileManager;
