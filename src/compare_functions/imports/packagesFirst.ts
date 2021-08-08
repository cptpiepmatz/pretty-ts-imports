import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../import_management/Import";

/**
 * Compares two imports for their package.
 * Sort packages higher than non packages.
 * @param importA Import A
 * @param importB Import B
 */
const packagesFirst: ImportCompareFunction = function(
  importA: Import,
  importB: Import
): -1 | 0 | 1 {
  if (importA.source.isPackage && !importB.source.isPackage) return -1;
  if (!importA.source.isPackage && importB.source.isPackage) return 1;
  return 0;
};

export default packagesFirst;
