import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compare two compare_imports for their import types.
 * A namespace import (* as something) comes before a named import ({a}).
 * @param a Import A
 * @param b Import B
 */
const namespaceBeforeNamed: ImportCompareFunction = function(a, b): -1 | 0 | 1 {
  if (a.isNamespace && b.isNamed) return -1;
  if (a.isNamed && b.isNamespace) return 1;
  return 0;
};

export default namespaceBeforeNamed;
