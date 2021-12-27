import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * Compares two import elements whether they are a function, object or Type.
 * If both elements are the same the will recognized as equal.
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {a, B, C, d} from "alphabet";
 *
 * // sorted
 * import {a, d, B, C} from "alphabet";
 * ```
 *
 * @param a Import Element A
 * @param b Import Element B
 */
const elementType: ImportElementCompareFunction = function(a, b) {
  const [aFunction, bFunction] = [a, b].map(m => +m.isFunctionOrObject);
  return aFunction - bFunction;
}

export default elementType;
