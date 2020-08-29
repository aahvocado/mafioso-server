import REGEX from 'constants/REGEXES';

import * as regexUtils from 'utilities/regexUtils';

export default class LogData {
  constructor(rawText) {
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
  get fileName() {
    return `${this.logHash}.txt`;
  }
}
