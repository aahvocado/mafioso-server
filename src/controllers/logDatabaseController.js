import fs from 'fs';

import DatabaseEntry from 'classes/DatabaseEntry';

import DATABASE_ENTRY_STATUS from 'constants/DATABASE_ENTRY_STATUSES';

import * as regexUtils from 'utilities/regexUtils';

const DB_PATH = process.env['DB_PATH'];
const SAVE_PATH = process.env['SAVE_PATH'];

class logDatabaseController {
  /** @default */
  constructor() {
    /** @type {String} */
    this.databasePath = DB_PATH;

    this.instantiate(DB_PATH);
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
   * @async
   * @param {Object} data
   * @param {Error} - returns error if something went wrong
   */
  addNewLog(data) {
    return new Promise((resolve, reject) => {
      const newEntry = new DatabaseEntry(data, `${this.entriesCount()}`);
      if (newEntry.logText === undefined) {
        return reject('No logText found!');
      }

      // we'll check is db has the entry (regardless if physical file exists)
      if (this.hasEntry(newEntry.logHash)) {
        return reject('Log already exists.');
      }

      // create new db entry
      this.addEntry(newEntry);

      // save the file on system, possible overriding existing
      const filePath = this.getFilePath({fileName: newEntry.fileName});
      fs.writeFile(filePath, newEntry.logText, (err) => {
        if (err) reject(err);
      });

      resolve();
    })
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
      return `${SAVE_PATH}/${fileName}`;
    }

    if (hash !== undefined) {
      return `${SAVE_PATH}/${hash}.txt`;
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
    const {
      isActive,
      status = DATABASE_ENTRY_STATUS.ACTIVE,
    } = config;

    const dbBuffer = fs.readFileSync(this.databasePath);
    const databaseText = dbBuffer.toString();
    const dataEntryList = databaseText.split('\n').map((dataRow) => new DatabaseEntry(dataRow));
    return dataEntryList.filter((dataEntry) => {
      if (!dataEntry.isValid) return false;

      if (isActive !== undefined) {
        return dataEntry.isActive === isActive;
      }

      // any means all
      if (status === DATABASE_ENTRY_STATUS.ANY) {
        return true;
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
  isEntryActive(hash) {
    const foundEntry = this.findEntry(hash);
    if (foundEntry === undefined) return false;

    return foundEntry.isActive;
  }
  /**
   * @param {String} hash
   * @param {DatabaseEntryStatus} [newStatus]
   * @returns {DatabaseEntry | undefined}
   */
  updateEntryStatus(hash, newStatus) {
    const entry = this.findEntry(hash);
    if (entry === undefined) return;

    // if no `newStatus` param was passed, we'll toggle it between active states
    if (newStatus === undefined) {
      entry.status = entry.isActive ? DATABASE_ENTRY_STATUS.INACTIVE : DATABASE_ENTRY_STATUS.ACTIVE;
    } else {
      entry.status = newStatus;
    }


    this.replaceEntry(hash, entry);
  }
}

export default new logDatabaseController();
