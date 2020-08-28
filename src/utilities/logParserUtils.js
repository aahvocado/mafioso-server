
/**
 * @param {Matcher} matcher
 * @return {String|undefined}
 */
export function findMatcher(searchStr, matcher) {
  // search for result of regex
  if (matcher instanceof RegExp) {
    const matchedText = searchStr.match(matcher) || [];
    return matchedText[0];
  }

  // example: ["I like big {1} and I can not {2}", "butts", "lie"]
  //  results in "I like big butts and I can not lie"
  if (Array.isArray(matcher)) {
    return matcher.reduce((result, innermatcher, idx) => {
      if (idx === 0) {
        return innermatcher;
      }

      const innerResult = findMatcher(searchStr, innermatcher);
      return result.replace(`{${idx}}`, innerResult);
    });
  }

  // not found - undefined
  return undefined;
}
