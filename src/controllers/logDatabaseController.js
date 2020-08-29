import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';
import LogData from 'classes/LogData';

import * as regexUtils from 'utilities/regexUtils';

const logDatabasePath = process.env['DB_PATH'];
const savePath = process.env['SAVE_PATH'];

class logDatabaseController {
  /** @default */
  constructor() {
    this.instantiate();
  }
  /**
   * creates the db txt file
   * @returns {String}
   */
  instantiate() {
    if (fs.existsSync(logDatabasePath)) {
      console.warn('"log-database.txt" already exists.');
      return;
    }

    fs.writeFileSync(logDatabasePath, '');
    console.log('Created new "log-database.txt".');
  }
  // -- file functions
  /**
   * @param {String} text
   */
  async addNewLog(fullText) {
    const logData = new LogData(fullText);

    const hasLog = await this.hasLog(logData);
    if (hasLog) return console.warn('... log already exists');

    // save the file on system
    const filePath = this.getFilePath({fileName: logData.fileName});
    fs.writeFile(filePath, fullText, (err) => {
      if (err) return console.error(err);
      console.log('... added new file', logData.fileName);
    });

    // create new db entry
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
   * @returns {Number}
   */
  getEntriesCount() {
    const databaseText = this.getDatabase();
    const entriesCount = (databaseText.match(/\n/g) || []).length;
    return entriesCount;
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
    const databaseText = this.getDatabase();
    const entryRegex = new RegExp(`^\\d+\\t${hash}.*`, 'mi');
    const entryRow = regexUtils.findMatcher(databaseText, entryRegex);
    if (entryRow === undefined) {
      return false;
    }

    const databaseEntry = new DatabaseEntry().import(entryRow);
    return databaseEntry;
  }
  /**
   * @param {LogData} logData
   */
  createNewEntry(logData) {
    const newEntry = new DatabaseEntry(logData, this.getEntriesCount());
    fs.appendFile(logDatabasePath, newEntry.export(), (err) => {
      if (err) return console.error(err);
    })
  }
  /**
   * @param {String} hash
   * @param {DatabaseEntry} newEntry
   */
  replaceEntry(hash, newEntry) {
    const databaseText = this.getDatabase();

    const oldEntry = this.findEntry(hash);
    const oldText = oldEntry.export();
    const newText = newEntry.export();

    databaseText.replace(oldText, newText);
  }
  /**
   * @param {String} hash
   * @param {Boolean} [toggleTo]
   * @returns {DatabaseEntry | undefined}
   */
  toggleEntryVisbility(hash, toggleTo) {
    const entry = this.findEntry(hash);
    if (entry === undefined) return;

    const newVisibility = toggleTo !== undefined ? toggleTo : !entry.visibility;
    entry.visibility = newVisibility;

    this.replaceEntry(has, entry);
  }
}

export default new logDatabaseController();
