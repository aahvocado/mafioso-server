export default class DatabaseEntry {
  /**
   * @param {Object|String} logData
   * @param {Number} entryId
   */
  constructor(logData, entryId) {
    if (logData === undefined) {
      return;
    }

    // if param is a string, can import from databaseRow
    if (typeof logData === 'string') {
      this.import(logData);
      return;
    }

    const createDate = new Date();

    /** @type {String} */
    this.entryId = entryId;
    /** @type {String} */
    this.visibility = 'true';
    /** @type {String} */
    this.entryDate = createDate.toDateString();
    /** @type {String} */
    this.logHash = logData.logHash;
    /** @type {String} */
    this.charName = logData.charName;
    /** @type {String} */
    this.pathName = logData.pathName;
    /** @type {String} */
    this.difficultyName = logData.difficultyName;
    /** @type {String} */
    this.dayCount = logData.dayCount;
    /** @type {String} */
    this.turnCount = logData.turnCount;
  }
  /** @type {String} */
  get isVisible() {
    return this.visibility === 'true';
  }
  /** @type {String} */
  get date() {
    return new Date(this.entryDate);
  }
  /**
   * @param {String} databaseRow
   */
  import(databaseRow) {
    const cleanRow = databaseRow.replace('\n', '');
    const entryPieces = cleanRow.split('\t');

    this.entryId = entryPieces[0];
    this.visibility = entryPieces[1];
    this.entryDate = entryPieces[2];
    this.logHash = entryPieces[3];
    this.charName = entryPieces[4];
    this.pathName = entryPieces[5];
    this.difficultyName = entryPieces[6];
    this.dayCount = entryPieces[7];
    this.turnCount = entryPieces[8];
  }
  /**
   * @returns {Object}
   */
  export() {
    return {
      logHash: this.logHash,
      charName: this.charName,
      pathName: this.pathName,
      difficultyName: this.difficultyName,
      dayCount: this.dayCount,
      turnCount: this.turnCount,
    }
  }
  /**
   * @returns {String}
   */
  toString() {
    return `${this.entryId}\t${this.visibility}\t${this.entryDate}\t${this.logHash}\t${this.charName}\t${this.pathName}\t${this.difficultyName}\t${this.dayCount}\t${this.turnCount}\n`;
  }
}
