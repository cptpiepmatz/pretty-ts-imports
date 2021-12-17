import ImportCompareFunction from "../ImportCompareFunction";

/**
 * Compares two compare_imports for their relative stats.
 * Sort relatives higher than non relatives.
 * @param a Import A
 * @param b Import B
 */
const relativesFirst: ImportCompareFunction = function(a, b): -1 | 0 | 1 {
  if (a.source.isRelative && !b.source.isRelative) return -1;
  if (!a.source.isRelative && b.source.isRelative) return 1;
  return 0;
};

export default relativesFirst;
