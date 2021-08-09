import ImportElement from "../../import_management/ImportElement";
import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * Puts Types in front of functions and objects.
 * @param a Import element A
 * @param b Import element B
 */
const typesFirst: ImportElementCompareFunction = function(a, b): -1 | 0 | 1 {
  if (a.isType && !b.isType) return -1;
  if (!a.isType && b.isType) return 1;
  return 0;
}

export default typesFirst;
