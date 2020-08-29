export default class DatabaseEntry {
  /** @default */
  constructor(logData, entryId) {
    if (logData === undefined) {
      return;
    }

    const createDate = new Date();

    /** @type {String} */
    this.entryId = entryId;
    /** @type {Boolean} */
    this.visibility = false;
    /** @type {Date} */
    this.entryDate = createDate.toDateString();
    /** @type {String} */
    this.hash = logData.logHash;
    /** @type {String} */
    this.charName = logData.charName;
    /** @type {String} */
    this.pathName = logData.pathName;
    /** @type {String} */
    this.difficultyName = logData.difficultyName;
  }
  /**
   * @param {String} databaseRow
   */
  import(databaseRow) {
    const entryPieces = databaseRow.split('\t');

    this.entryId = entryPieces[0];
    this.visibility = Boolean(entryPieces[1]);
    this.entryDate = entryPieces[2];
    this.hash = entryPieces[3];
    this.charName = entryPieces[4];
    this.pathName = entryPieces[5];
    this.difficultyName = entryPieces[6];
  }
  /**
   * @returns {String}
   */
  export() {
    return `${this.entryId}\t${this.visibility}\t${this.entryDate}\t${this.hash}\t${this.charName}\t${this.pathName}\t${this.difficultyName}\n`;
  }
}
