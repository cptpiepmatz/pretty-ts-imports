import SeparateByFunction from "../SeparateByFunction";

/**
 * Place a separator between two imports if one of them is using a namespace
 * import and the other one is not.
 *
 * <b>Example:</b>
 * ```ts
 * // unseparated
 * import everything from "stuff";
 * import everyone from "people";
 * import * as everywhere from "places";
 * import * as everyway from "ways";
 * import everybody from "persons";
 *
 * // separated
 * import everything from "stuff";
 * import everyone from "people";
 *
 * import * as everywhere from "places";
 * import * as everyway from "ways";
 *
 * import everybody from "persons";
 * ```
 * @see Import#isNamespace
 * @param l Leading Import
 * @param f Following Import
 */
const unequalNamespaceUse: SeparateByFunction = function(l, f) {
  return l.isNamespace !== f.isNamespace;
}

export default unequalNamespaceUse;
