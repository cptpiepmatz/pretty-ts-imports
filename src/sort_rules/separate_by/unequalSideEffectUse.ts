import SeparateByFunction from "../SeparateByFunction";

/**
 * Place a separator between two imports if one of them is importing only for
 * side effects.
 *
 * <b>Example:</b>
 * ```ts
 * // unseparated
 * import a from "alpha";
 * import b from "bravo";
 * import "charlie";
 * import "delta";
 * import e from "echo";
 *
 * // separated
 * import a from "alpha";
 * import b from "bravo";
 *
 * import "charlie";
 * import "delta";
 *
 * import e from "echo";
 * ```
 * @see Import#isSideEffectOnly
 * @param l Leading Import
 * @param f Following Import
 */
const unequalSideEffectUse: SeparateByFunction = function(l, f) {
  return l.isSideEffectOnly !== f.isSideEffectOnly;
}

export default unequalSideEffectUse;
