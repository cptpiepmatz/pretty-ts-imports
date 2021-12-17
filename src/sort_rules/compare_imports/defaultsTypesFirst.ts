import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two default compare_imports.
 * Default compare_imports that represent a type are first.
 * @param a Import A
 * @param b Import B
 */
const defaultsTypesFirst: ImportCompareFunction = function(a, b): -1 | 0 | 1 {
  if (a.defaultElement && b.defaultElement) {
    if (a.defaultElement.isType && !b.defaultElement.isType) {
      return -1;
    }
    if (!a.defaultElement.isType && b.defaultElement.isType) {
      return 1;
    }
  }
  return 0;
};

export default defaultsTypesFirst;
