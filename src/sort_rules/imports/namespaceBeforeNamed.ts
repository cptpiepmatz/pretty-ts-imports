import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../import_management/Import";

/**
 * Compare two imports for their import types.
 * A namespace import (* as something) comes before a named import ({a}).
 * @param importA Import A
 * @param importB Import B
 */
const namespaceBeforeNamed: ImportCompareFunction = function(
  importA: Import,
  importB: Import
): -1 | 0 | 1 {
  if (importA.isNamespace && importB.isNamed) return -1;
  if (importA.isNamed && importB.isNamespace) return 1;
  return 0;
};

export default namespaceBeforeNamed;
