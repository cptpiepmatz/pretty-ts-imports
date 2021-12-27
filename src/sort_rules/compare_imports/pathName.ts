import ImportCompareFunction from "../ImportCompareFunction";
import {dirname} from "path";

/**
 * Compares two source paths by their dir hierarchy from top to bottom.
 * Every element of the tree is compared against the other source and
 * alphabetically ordered.
 *
 * <i>This ignores package names.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import c from "./alpha-beta/alpha";
 * import b from "./alpha/gamma";
 * import a from "./alpha/beta";
 *
 * // sorted
 * import a from "./alpha/beta";
 * import b from "./alpha/gamma";
 * import c from "./alpha-beta/alpha";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const pathName: ImportCompareFunction = function(a, b) {
  if ([a, b].some(m => m.source.isPackage)) return 0;
  const [dirsA, dirsB] = [a, b].map(m => dirname(m.source.name).split("\n"));
  const minLength = Math.min(dirsA.length, dirsB.length);
  for (let i = 0; i < minLength; i++) {
    const comparison = dirsA[i].localeCompare(dirsB[i]);
    if (comparison) return comparison;
  }
  return 0;
}

export default pathName;
