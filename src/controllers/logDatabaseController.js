import fs from 'fs';

import LogData from 'classes/LogData';

const logDatabasePath = process.env['DB_PATH'];
const savePath = process.env['SAVE_PATH'];

class logDatabaseController {
  constructor() {
    this.instantiate();
  }
  /**
   * creates the db txt file
   */
  instantiate() {
    if (fs.existsSync(logDatabasePath)) {
      console.warn('"log-database.txt" already exists.');
      return;
    }

    fs.writeFile(logDatabasePath, '', (err) => {
     if (err) return console.log(err);

      console.log('Created "log-database.txt".');
    });
  }
  // -- file functions
  /**
   * @param {String} text
   */
  addNewFile(fullText) {
    const logData = new LogData(fullText);
    this.findLogFile({hash: logData.logHash});

    fs.writeFile(this.getFilePath(logData.fileName), fullText, (err) => {
      if (err) return console.log(err);
      console.log('...added new file', logData.fileName);
    });

    // create new entry
    this.addNewEntry(logData);
  }
  /**
   * @param {Object} param
   * @returns {String}
   */
  getFilePath(param) {
    if (param.fileName !== undefined) {
      return `${savePath}${fileName}`;
    }

    if (param.hash !== undefined) {
      return `${savePath}${hash}.txt`;
    }
  }
  /**
   * @param {Object} params
   * @returns {File}
   */
  findLogFile(params) {
    const filePath = this.getFilePath(params);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
    });
  }
  // -- database functions
  /**
   * @param {LogData} logData
   */
  addNewEntry(logData) {
    const nowDate = new Date();
    const newEntry = `${logData.logHash}\t${logData.charName}\t${nowDate.toDateString()}\n`

    fs.appendFile(logDatabasePath, newEntry, (err) => {
      if (err) return console.log(err);
    })
  }
}

export default new logDatabaseController();
