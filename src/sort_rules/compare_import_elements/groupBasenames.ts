import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * This tries to group elements based on their names together.
 * It works it's way from the back to move something like 'AlphaStuff' and
 * 'BetStuff' close together.
 * @param a Import element A
 * @param b Import element B
 */
const groupBasenames: ImportElementCompareFunction = function(a, b) {
  if (a.isFunctionOrObject || b.isFunctionOrObject) return 0;

  const matcher = /([A-Z][a-z]*)/g;
  const aMatches = a.name.match(matcher);
  const bMatches = b.name.match(matcher);

  const aParts = Array.from(aMatches as string[]).reverse();
  const bParts = Array.from(bMatches as string[]).reverse();
  const partsLength = Math.min(aParts.length, bParts.length);

  for (let i = 0; i < partsLength; i++) {
    const comparison = aParts[i].localeCompare(bParts[i]);
    if (comparison !== 0) return comparison;
  }
  return 0;
}

export default groupBasenames;
