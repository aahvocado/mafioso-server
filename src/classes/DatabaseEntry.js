export default class DatabaseEntry {
  /** @default */
  constructor(entryRow) {
    const cells = entryRow.split('\t');

    /** @type {String} */
    this.entryId = cells[0];
    /** @type {String} */
    this.hash = cells[1];
    /** @type {String} */
    this.charName = cells[2];
    /** @type {Date} */
    this.entryDate = new Date(cells[3]);
  }
}
