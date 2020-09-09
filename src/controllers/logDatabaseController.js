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
      if (this.hasEntry(newEntry.hashcode)) {
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
    } = param;

    if (fileName !== undefined) {
      return `${SAVE_PATH}/${fileName}`;
    }

    return `${SAVE_PATH}`;
  }
  /**
   * @param {DatabaseEntry} databaseEntry
   * @returns {Boolean}
   */
  hasLog(databaseEntry) {
    const logFilePath = this.getFilePath({fileName: databaseEntry.fileName});
    try {
      fs.accessSync(logFilePath, fs.constants.R_OK);
      return true;

    } catch (err) {
      return false;
    }
  }
  /**
   * @param {DatabaseEntry} databaseEntry
   * @returns {String}
   */
  findLog(databaseEntry) {
    const logFilePath = this.getFilePath({fileName: databaseEntry.fileName});
    if (logFilePath === undefined) {
      console.error(`Unable to find filepath for "${databaseEntry.fileName}"`);
      return;
    }
    const dbBuffer = fs.readFileSync(logFilePath);
    return dbBuffer.toString();
  }
  /**
   * @param {String} hashcode
   * @returns {String}
   */
  getLogByHash(hashcode) {
    const databaseEntry = this.findEntry(hashcode);
    if (databaseEntry === undefined) {
      console.error(`Unable to find log entry for "${hashcode}"`);
      return;
    }
    return this.findLog(databaseEntry);
  }
  // -- database functions
  /**
   * @param {Object} [options]
   * @returns {Array<DatabaseEntry>}
   */
  getDatabase(options = {}) {
    const {
      isActive,
      status = DATABASE_ENTRY_STATUS.MOST,
    } = options;

    const dbBuffer = fs.readFileSync(this.databasePath);
    const databaseText = dbBuffer.toString();
    const dataEntryList = databaseText
      .split('\n')
      .map((dataRow) => new DatabaseEntry(dataRow))
      .filter((dataEntry) => dataEntry.isValid);

    // return everything for ANY
    if (status === DATABASE_ENTRY_STATUS.ANY || status === undefined) {
      return dataEntryList;
    }

    // return not disabled if MOST
    if (status === DATABASE_ENTRY_STATUS.MOST || status === undefined) {
      return dataEntryList.filter((dataEntry) => dataEntry.status !== DATABASE_ENTRY_STATUS.DISABLED);
    }

    const optionKeys = Object.keys(options);
    return dataEntryList.filter((dataEntry) => {
      return !optionKeys.some((optionName) => dataEntry[optionName] !== options[optionName]);
    });
  }
  /**
   * @returns {Number}
   */
  entriesCount() {
    return this.getDatabase({status: DATABASE_ENTRY_STATUS.ANY}).length;
  }
  /**
   * @param {String} hashcode
   * @returns {Boolean}
   */
  hasEntry(hashcode) {
    return this.findEntry(hashcode) !== undefined;
  }
  /**
   * @param {String} hashcode
   * @returns {DatabaseEntry | undefined}
   */
  findEntry(hashcode) {
    const database = this.getDatabase({status: DATABASE_ENTRY_STATUS.ANY});
    const foundEntry = database.find((databaseEntry) => databaseEntry.hashcode === hashcode);
    return foundEntry;
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
   * @param {String} hashcode
   * @param {DatabaseEntry} newEntry
   */
  replaceEntry(hashcode, newEntry) {
    const databaseText = this.toString().slice();

    const oldEntry = this.findEntry(hashcode);
    const oldText = oldEntry.toString();
    const newText = newEntry.toString();

    const newDatabaseText = databaseText.replace(oldText, newText);

    // overwrite to DB
    fs.writeFileSync(this.databasePath, newDatabaseText);
  }
  /**
   * @param {String} hashcode
   * @returns {Boolean}
   */
  isEntryActive(hashcode) {
    const foundEntry = this.findEntry(hashcode);
    if (foundEntry === undefined) return false;

    return foundEntry.isActive;
  }
  /**
   * @param {String} hashcode
   * @param {DatabaseEntryStatus} [newStatus]
   * @returns {DatabaseEntry | undefined}
   */
  updateEntryStatus(hashcode, newStatus) {
    const entry = this.findEntry(hashcode);
    if (entry === undefined) return;

    // if no `newStatus` param was passed, we'll toggle it between active states
    if (newStatus === undefined) {
      entry.status = entry.isActive ? DATABASE_ENTRY_STATUS.INACTIVE : DATABASE_ENTRY_STATUS.ACTIVE;
    } else {
      entry.status = newStatus;
    }

    this.replaceEntry(hashcode, entry);
  }
}

export default new logDatabaseController();
