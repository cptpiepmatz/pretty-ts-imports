import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two imports whether they are for side effects only or not.
 * Imports with only side effects are considered lesser (higher position).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import a from "alpha";
 * import "beta";
 * import c from "charlie";
 *
 * // sorted
 * import "beta";
 * import a from "alpha";
 * import c from "charlie";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const sideEffect: ImportCompareFunction = function(a, b) {
  const aDefault = a.isSideEffectOnly ? 0 : 1;
  const bDefault = b.isSideEffectOnly ? 0 : 1;
  return aDefault - bDefault;
}

export default sideEffect;
