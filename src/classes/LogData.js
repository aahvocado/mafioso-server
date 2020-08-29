import REGEX from 'constants/REGEXES';

import * as regexUtils from 'utilities/regexUtils';

export default class LogData {
  /** @default */
  constructor(rawText) {
    /** @type {String} */
    this.rawText = rawText;
  }
  /** @type {String} */
  get logHash() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.HASH);
  }
  /** @type {String} */
  get charName() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.NAME);
  }
  /** @type {String} */
  get pathName() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.PATH);
  }
  /** @type {String} */
  get difficultyName() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.DIFFICULTY);
  }
  /** @type {String} */
  get dayCount() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.DAYS);
  }
  /** @type {String} */
  get turnCount() {
    return regexUtils.findMatcher(this.rawText, REGEX.PREAMBLE.TURNS);
  }
  /** @type {String} */
  get fileName() {
    return `${this.logHash}.txt`;
  }
  /**
   * @returns {String}
   */
  export() {
    return this.rawText;
  }
}
