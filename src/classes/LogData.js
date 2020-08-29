import REGEX from 'constants/REGEXES';

import * as logParserUtils from 'utilities/logParserUtils';

export default class LogData {
  constructor(rawText) {
    this.rawText = rawText;
  }
  /** @type {String} */
  get logHash() {
    return logParserUtils.findMatcher(this.rawText, REGEX.PREAMBLE.HASH);
  }
  /** @type {String} */
  get charName() {
    return logParserUtils.findMatcher(this.rawText, REGEX.PREAMBLE.NAME);
  }
  /** @type {String} */
  get pathName() {
    return logParserUtils.findMatcher(this.rawText, REGEX.PREAMBLE.PATH);
  }
  /** @type {String} */
  get difficultyName() {
    return logParserUtils.findMatcher(this.rawText, REGEX.PREAMBLE.DIFFICULTY);
  }
  /** @type {String} */
  get fileName() {
    return `${this.logHash}.txt`;
  }
}
