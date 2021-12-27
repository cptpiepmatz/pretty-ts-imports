import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two imports by their presence of a default import.
 * An import with a default import is considered lesser (positioned higher).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {a, b, c} from "alpha";
 * import d, {e, f} from "beta";
 *
 * // sorted
 * import d, {e, f} from "beta";
 * import {a, b, c} from "alpha";
 * ```
 *
 * @see ImportElement#isDefault
 * @param a Import A
 * @param b Import B
 */
const defaultPresence: ImportCompareFunction = function(a, b) {
  const aDefault = a.defaultElement ? 0 : 1;
  const bDefault = b.defaultElement ? 0 : 1;
  return aDefault - bDefault;
}

export default defaultPresence;
