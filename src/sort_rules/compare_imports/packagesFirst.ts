import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two compare_imports for their package.
 * Sort packages higher than non packages.
 * @param a Import A
 * @param b Import B
 */
const packagesFirst: ImportCompareFunction = function(a, b): -1 | 0 | 1 {
  if (a.source.isPackage && !b.source.isPackage) return -1;
  if (!a.source.isPackage && b.source.isPackage) return 1;
  return 0;
};

export default packagesFirst;
