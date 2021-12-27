import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * Compares two import element names by their name alphabetically.
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {c, d, e, a} from "alphabet";
 *
 * // sorted
 * import {a, b, c, d} from "alphabet";
 * ```
 *
 * @param a Import Element A
 * @param b Import Element B
 */
const elementName: ImportElementCompareFunction = function(a, b) {
  return a.name.localeCompare(b.name);
}

export default elementName;
