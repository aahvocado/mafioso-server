import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';
import LogData from 'classes/LogData';

import * as regexUtils from 'utilities/regexUtils';

const logDatabasePath = process.env['DB_PATH'];
const savePath = process.env['SAVE_PATH'];

class logDatabaseController {
  /** @default */
  constructor() {
    /** @type {String} */
    this.databasePath = logDatabasePath;

    this.instantiate(logDatabasePath);
  }
  /**
   * creates the db txt file
   *
   * @param {String} path
   * @returns {String}
   */
  instantiate(path) {
    this.databasePath = path; // if reinstatiating, update path

    if (fs.existsSync(path)) {
      console.warn(`Using existing database at: ${path}.`);
      return;
    }

    fs.writeFileSync(path, '');
    console.log(`Created new database at: ${path}.`);
  }
  /**
   * @returns {String}
   */
  toString() {
    const dbBuffer = fs.readFileSync(this.databasePath);
    const databaseText = dbBuffer.toString();
    return databaseText;
    // return await Buffer.from(databaseText, 'utf8');
  }
  // -- file functions
  /**
   * @param {String} text
   */
  async addNewLog(fullText) {
    const logData = new LogData(fullText);

    // we'll check is db has the entry (regardless if physical file exists)
    if (this.hasEntry(logData.logHash)) {
      return console.warn('... log already exists');
    }

    // save the file on system, possible overriding existing
    const filePath = this.getFilePath({fileName: logData.fileName});
    fs.writeFile(filePath, fullText, (err) => {
      if (err) return console.error(err);
      console.log('... added new file', logData.fileName);
    });

    // create new db entry
    const newEntry = new DatabaseEntry(logData, this.entriesCount());
    return this.addEntry(newEntry);
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
  findLog(logData) {
    const logFilePath = this.getFilePath({fileName: logData.fileName});
    if (logFilePath === undefined) {
      console.error(`Unable to find filepath for "${logData.fileName}"`);
      return;
    }
    const dbBuffer = fs.readFileSync(logFilePath);
    return dbBuffer.toString();
  }
  /**
   * @param {String} hash
   * @returns {String}
   */
  getLogByHash(hash) {
    const logData = this.findEntry(hash);
    if (logData === undefined) {
      console.error(`Unable to find log entry for "${hash}"`);
      return;
    }
    return this.findLog(logData);
  }
  // -- database functions
  /**
   * @param {Object} [config]
   * @returns {Array<DatabaseEntry>}
   */
  getDatabase(config = {}) {
    const {isVisible} = config;

    const dbBuffer = fs.readFileSync(this.databasePath);
    const databaseText = dbBuffer.toString();
    const dataEntryList = databaseText.split('\n').map((dataRow) => new DatabaseEntry(dataRow));
    return dataEntryList.filter((dataEntry) => {
      if (isVisible !== undefined) {
        return dataEntry.isVisible === isVisible;
      }

      return true;
    });
  }
  /**
   * @returns {Number}
   */
  entriesCount() {
    return this.getDatabase().length;
  }
  /**
   * @param {String} hash
   * @returns {Boolean}
   */
  hasEntry(hash) {
    return this.findEntry(hash) !== undefined;
  }
  /**
   * @param {String} hash
   * @returns {DatabaseEntry | undefined}
   */
  findEntry(hash) {
    const database = this.getDatabase();
    return database.find((databaseEntry) => databaseEntry.logHash === hash);
  }
  /**
   * @async
   * @param {DatabaseEntry} newEntry
   */
  addEntry(newEntry) {
    return new Promise((resolve, reject) => {
      fs.appendFile(this.databasePath, newEntry.toString(), (err) => {
        if (err) return reject(err);

        resolve();
      })
    })
  }
  /**
   * @param {String} hash
   * @param {DatabaseEntry} newEntry
   */
  replaceEntry(hash, newEntry) {
    const databaseText = this.toString().slice();

    const oldEntry = this.findEntry(hash);
    const oldText = oldEntry.toString();
    const newText = newEntry.toString();

    const newDatabaseText = databaseText.replace(oldText, newText);

    // overwrite to DB
    fs.writeFileSync(this.databasePath, newDatabaseText);
  }
  /**
   * @param {String} hash
   * @returns {Boolean}
   */
  isEntryVisible(hash) {
    const foundEntry = this.findEntry(hash);
    if (foundEntry === undefined) {
      return false;
    }

    return foundEntry.isVisible;
  }
  /**
   * @param {String} hash
   * @param {Boolean} [toggleTo]
   * @returns {DatabaseEntry | undefined}
   */
  toggleEntryVisbility(hash, toggleTo) {
    const entry = this.findEntry(hash);
    if (entry === undefined) return;

    const newVisibility = toggleTo !== undefined ? toggleTo : !entry.isVisible;
    entry.visibility = newVisibility;

    this.replaceEntry(hash, entry);
  }
}

export default new logDatabaseController();
