import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two default imports whether one of them is a type.
 * Element recognized as type imports are considered lesser (higher position).
 *
 * <i>This ignores imports without default imports.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {gamma} from "Gamma";
 * import alpha from "Alpha";
 * import Beta from "Beta";
 *
 * // sorted
 * import {gamma} from "Gamma";
 * import Beta from "Beta";
 * import alpha from "Alpha";
 * ```
 *
 * @see ImportElement#isType
 * @param a Import A
 * @param b Import B
 */
const defaultType: ImportCompareFunction = function(a, b) {
  const aDefault = a.defaultElement;
  const bDefault = b.defaultElement;
  if (!aDefault || !bDefault) return 0;
  const aType = aDefault.isType ? 0 : 1;
  const bType = bDefault.isType ? 0 : 1;
  return aType - bType;
}

export default defaultType;
