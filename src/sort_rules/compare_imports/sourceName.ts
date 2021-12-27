import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two imports based on their source name alphabetically.
 *
 * <i>This ignores relative sources. </i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import a from "beta";
 * import b from "alpha";
 *
 * // sorted
 * import b from "alpha";
 * import a from "beta";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const sourceName: ImportCompareFunction = function(a, b) {
  if ([a, b].some(m => m.source.isRelative)) return 0;
  return a.source.name.localeCompare(b.source.name);
}

export default sourceName;
