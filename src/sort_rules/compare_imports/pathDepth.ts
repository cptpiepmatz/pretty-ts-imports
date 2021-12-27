import ImportCompareFunction from "../ImportCompareFunction";
import {dirname} from "path";

/**
 * Compares two path for their depth.
 * The deeper path is considered greater.
 *
 * <i>This ignores package names.</i>
 *
 * <b>Note: This does not take the path names into account.</b>
 *
 * <b>Example: </b>
 * ```ts
 * // unsorted
 * import a from "./longer/path";
 * import b from "./short-path";
 *
 * // sorted
 * import b from "./short-path";
 * import a from "./longer/path";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const pathDepth: ImportCompareFunction = function(a, b) {
  if ([a, b].some(m => m.source.isPackage)) return 0;
  const [dirsA, dirsB] = [a, b].map(m => m.source.name.split("/").length);
  return dirsA - dirsB;
}

export default pathDepth;
