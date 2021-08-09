import ImportElement from "../../import_management/ImportElement";
import ImportElementCompareFunction from "../ImportElementCompareFunction";

/**
 * Puts Types in front of functions and objects.
 * @param importElementA Import element A
 * @param importElementB Import element B
 */
const typesFirst: ImportElementCompareFunction = function(
  importElementA: ImportElement,
  importElementB: ImportElement
): -1 | 0 | 1 {
  if (importElementA.isType && !importElementB.isType) return -1;
  if (!importElementA.isType && importElementB.isType) return 1;
  return 0;
}

export default typesFirst;
