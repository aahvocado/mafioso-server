import {decode} from 'base-64';

import DATABASE_ENTRY_STATUS from 'constants/DATABASE_ENTRY_STATUSES';

export default class DatabaseEntry {
  /**
   * @param {Object|String} logData
   * @param {String} entryId
   */
  constructor(logData, entryId) {
    /** @type {String} */
    this.entryId = entryId;
    /** @type {DatabaseEntryStatus} */
    this.status = logData.status || DATABASE_ENTRY_STATUS.ACTIVE;
    /** {Object} logData */
    this.logData = {};

    // if param is a string, need to format it
    if (typeof logData === 'string') {
      this.import(logData);

    } else {
      this.logData = logData;
    }

    // if no date string was given, give it one now
    if (logData.entryDate === undefined || logData.entryDate === 'undefined') {
      const currentDate = new Date();
      this.logData.entryDate = currentDate.toDateString();
    }
  }
  /** @type {String} */
  get entryDate() {
    return this.logData.entryDate;
  }
  /** @type {String} */
  get characterName() {
    return this.logData.characterName;
  }
  /** @type {String} */
  get difficultyName() {
    return this.logData.difficultyName;
  }
  /** @type {String} */
  get pathName() {
    return this.logData.pathName;
  }
  /** @type {String} */
  get dayCount() {
    return this.logData.dayCount;
  }
  /** @type {String} */
  get turnCount() {
    return this.logData.turnCount;
  }
  /** @type {String} */
  get hashcode() {
    return String(this.logData.hashcode);
  }
  /** @type {String} */
  get logText() {
    return this.logData.logText;
  }
  // --
  /** @type {String} */
  get isValid() {
    return this.entryId !== 'undefined' && this.entryId !== undefined && this.entryId !== '';
  }
  /** @type {String} */
  get isActive() {
    return this.status === DATABASE_ENTRY_STATUS.ACTIVE;
  }
  /** @type {Date} */
  get date() {
    return new Date(this.entryDate);
  }
  /** @type {String} */
  get fileName() {
    return `${decode(this.hashcode)}`;
  }
  // --
  /**
   * @param {Boolean} toActive
   */
  updateStatus(toActive) {
    if (toActive) {
      this.status = DATABASE_ENTRY_STATUS.ACTIVE;
    } else {
      this.status = DATABASE_ENTRY_STATUS.INACTIVE;
    }
  }
  // --
  /**
   * @returns {String}
   */
  toString() {
    return `${this.entryId}\t${this.status}\t${this.entryDate}\t${this.hashcode}\t${this.characterName}\t${this.pathName}\t${this.difficultyName}\t${this.dayCount}\t${this.turnCount}\n`;
  }
  /**
   * @param {String} databaseRow
   * @param {String} [logText]
   */
  import(databaseRow, logText) {
    const cleanRow = databaseRow.replace('\n', '');
    const entryPieces = cleanRow.split('\t');

    this.entryId = entryPieces[0];
    this.status = entryPieces[1];

    this.logData = {
      entryDate: entryPieces[2],
      hashcode: entryPieces[3],
      characterName: entryPieces[4],
      pathName: entryPieces[5],
      difficultyName: entryPieces[6],
      dayCount: entryPieces[7],
      turnCount: entryPieces[8],
      logText: logText,
    }
  }
  /**
   * @returns {Object}
   */
  export() {
    return {
      ...this.logData,
      entryId: this.entryId,
      status: this.status,
    }
  }
}
