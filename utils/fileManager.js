const fs = require('fs');

const promisedFM = {
  _writeFile(path, string, resolve) {
    fs.writeFile(path, string, (err) => {
      if (err) {
        console.log(`Unsuccessful writing file. Path: ${path}. Error: ${err}`);
        resolve(false);
      } else {
        resolve(true);
      }
    });
  },
  saveFile(dir, filename, content) {
    return new Promise((resolve, reject) => {
      this.exists(dir)
        .then(success => {
          if (success) { // directory exists
            this._writeFile(`${dir}/${filename}`, JSON.stringify(content), resolve);
          } else { // no directory
            this.createDir(dir)
              .then(success => {
                if (success) {
                  this._writeFile(`${dir}/${filename}`, JSON.stringify(content), resolve);
                }
              }, err => {
                reject(err);
              });
          }
        });
    });
  },
  exists(path) {
    return new Promise((resolve) => {
      fs.access(path, fs.constants.F_OK, (err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },
  isDir(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if (err) {
          reject(err);
        }

        resolve(stats.isDirectory());
      });
    });
  },
  createDir(path) {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, err => {
        if (err) {
          reject(err.code);
        }

        resolve(true);
      });
    });
  }
};

const fileManager = {
  _knowledgeDir: 'knowledge',
  _logsDir: 'logs',
  _knowledgeFilename: 'agent',
  saveAgentKnowledge(knowledge) {
    const timestamp = new Date();

    promisedFM.saveFile(this._knowledgeDir, this._knowledgeFilename + timestamp, knowledge);
  },
  saveStats(botName, stats) {
    const timestamp = new Date();

    promisedFM.saveFile(this._logsDir, botName + timestamp, stats)
      .then(success => console.log(`Saving file success ${success}`))
      .catch(err => console.log(`Saving file error ${err}`));
  }
};

module.exports = fileManager;
