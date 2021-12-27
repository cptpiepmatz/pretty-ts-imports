import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two import sources whether they are relatives or packages.
 * A relative path is considered greater (positioned lower).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import b from "./Beta";
 * import c from "Gamma";
 * import a from "Alpha";
 *
 *
 * // sorted
 * import c from "Gamma";
 * import a from "Alpha";
 * import b from "./Beta";
 * ```
 *
 * @see ImportSource#isPackage
 * @see ImportSource#isRelative
 * @param a Import A
 * @param b Import B
 */
const sourceType: ImportCompareFunction = function(a, b) {
  const aPackage = a.source.isPackage ? 0 : 1;
  const bPackage = b.source.isPackage ? 0 : 1;
  return aPackage - bPackage;
}

export default sourceType;
