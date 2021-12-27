import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compare two imports by their presence of a namespace import.
 * An import with a namespace import is considered lesser (positioned higher).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import alpha from "Alpha";
 * import * as beta from "Beta";
 *
 * // sorted
 * import * as beta from "Beta";
 * import alpha from "Alpha";
 * ```
 *
 * @see Import#isNamespace
 * @param a Import A
 * @param b Import B
 */
const namespacePresence: ImportCompareFunction = function(a, b) {
  const aNamespace = a.isNamespace ? 0 : 1;
  const bNamespace = b.isNamespace ? 0 : 1;
  return aNamespace - bNamespace;
}

export default namespacePresence;
