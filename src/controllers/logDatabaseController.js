import fs from 'fs';

// import DatabaseEntry from 'classes/DatabaseEntry';
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
    const hasLog = await this.hasLog(logData);
    if (hasLog) {
      console.log('... log already exists');
      return;
    }

    fs.writeFile(this.getFilePath({fileName: logData.fileName}), fullText, (err) => {
      if (err) return console.error(err);
      console.log('... added new file', logData.fileName);
    });

    // create new entry
    this.createNewEntry(logData);
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
   * @param {LogData} logData
   * @returns {Boolean}
   */
  hasLog(logData) {
    const logFilePath = this.getFilePath({fileName: logData.fileName});
    try {
      fs.accessSync(logFilePath, fs.constants.R_OK);
      return true;

    } catch (err) {
      return false;
    }
  }
  /**
   * @param {LogData} logData
   * @returns {String}
   */
  getLog(logData) {
    const logFilePath = this.getFilePath({fileName: logData.fileName});
    const dbBuffer = fs.readFileSync(logFilePath);
    return dbBuffer.toString();
  }
  // -- database functions
  /**
   * @returns {String}
   */
  getDatabase() {
    const dbBuffer = fs.readFileSync(logDatabasePath);
    return dbBuffer.toString();
  }
  /**
   * @param {LogData} logData
   */
  createNewEntry(logData) {
    const nowDate = new Date();
    const newEntry = `${0}\t${logData.logHash}\t${logData.charName}\t${nowDate.toDateString()}\n`

    fs.appendFile(logDatabasePath, newEntry, (err) => {
      if (err) return console.error(err);
    })
  }
}

export default new logDatabaseController();
