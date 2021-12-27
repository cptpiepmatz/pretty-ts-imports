import SeparateByFunction from "../SeparateByFunction";

/**
 * Place a separator between two imports if one of them is imported from a
 * package and the other one from a relative path.
 *
 * <b>Example:</b>
 * ```ts
 * // unseparated
 * import a from "alpha";
 * import b from "beta";
 * import c from "./gamma";
 * import d from "./delta";
 * import e from "epsilon";
 *
 * // separated
 * import a from "alpha";
 * import b from "beta";
 *
 * import c from "./gamma";
 * import d from "./delta";
 *
 * import e from "epsilon";
 * ```
 *
 * @see ImportElement#isPackage
 * @see ImportElement#isRelative
 * @param leading Leading Import
 * @param following Following Import
 */
const unequalPackageState: SeparateByFunction = function(leading, following): boolean {
  const leadingIsPackage = leading.source.isPackage;
  const followingIsPackage = following.source.isPackage;
  return leadingIsPackage !== followingIsPackage;
};

export default unequalPackageState;
