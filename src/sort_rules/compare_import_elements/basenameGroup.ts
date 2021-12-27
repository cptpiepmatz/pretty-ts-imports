import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * Compares two import elements based on their names split apart on capital
 * letters.
 * Then this runs the sub words in reverse order to check for likeness.
 * If all sub words are the same but one is longer this will be recognized as
 * equal.
 *
 * <i>This ignores every element that is not a type.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {StartBase, Stuff, OtherBase, PowStuff} from "stuff";
 *
 * // sorted
 * import {StartBase, OtherBase, Stuff, PowStuff} from "stuff";
 * ```
 *
 * @see ImportElement#isFunctionOrObject
 * @param a Import Element A
 * @param b Import Element B
 */
const basenameGroup: ImportElementCompareFunction = function(a, b) {
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

export default basenameGroup;
