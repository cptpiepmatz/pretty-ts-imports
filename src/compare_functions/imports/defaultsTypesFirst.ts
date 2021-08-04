import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../Import";

/**
 * Compares two default imports.
 * Default imports that represent a type are first.
 * @param importA Import A
 * @param importB Import B
 */
const defaultsTypesFirst: ImportCompareFunction = function(
  importA: Import,
  importB: Import
): -1 | 0 | 1 {
  if (importA.defaultElement && importB.defaultElement) {
    if (importA.defaultElement.isType && !importB.defaultElement.isType) {
      return -1;
    }
    if (!importA.defaultElement.isType && importB.defaultElement.isType) {
      return 1;
    }
  }
  return 0;
}

export default defaultsTypesFirst;
