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
  async addNewFile(fullText) {
    const logData = new LogData(fullText);

    const hasFile = await this.hasFile({hash: logData.logHash});
    if (hasFile) {
      console.log('... log already exists');
      return;
    }

    fs.writeFile(this.getFilePath({fileName: logData.fileName}), fullText, (err) => {
      if (err) return console.error(err);
      console.log('... added new file', logData.fileName);
    });

    // create new entry
    this.addNewEntry(logData);
  }
  /**
   * @param {Object} param
   * @returns {String}
   */
  getFilePath(param) {
    const {
      fileName,
      hash,
    } = param;

    if (fileName !== undefined) {
      return `${savePath}${fileName}`;
    }

    if (hash !== undefined) {
      return `${savePath}${hash}.txt`;
    }
  }
  /**
   * @param {Object} param
   * @returns {File}
   */
  findLogFile(param) {
    const filePath = this.getFilePath(param);
    fs.access(filePath, fs.constants.F_OK, (err) => {
      console.log(`${filePath} ${err ? 'does not exist' : 'exists'}`);
    });
  }
  /**
   * @param {String} hash
   * @returns {Boolean}
   */
  hasFile(param) {
    const filePath = this.getFilePath(param);
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      return true;

    } catch (err) {
      return false;
    }
  }
  // -- database functions
  /**
   * @param {LogData} logData
   */
  addNewEntry(logData) {
    const nowDate = new Date();
    const newEntry = `${logData.logHash}\t${logData.charName}\t${nowDate.toDateString()}\n`

    fs.appendFile(logDatabasePath, newEntry, (err) => {
      if (err) return console.error(err);
    })
  }
}

export default new logDatabaseController();
