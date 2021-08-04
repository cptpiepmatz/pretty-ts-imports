import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../Import";

/**
 * Compares two imports for their relative stats.
 * Sort relatives higher than non relatives.
 * @param importA Import A
 * @param importB Import B
 */
const relativesFirst: ImportCompareFunction = function(
  importA: Import,
  importB: Import
): -1 | 0 | 1 {
  if (importA.source.isRelative && !importB.source.isRelative) return -1;
  if (!importA.source.isRelative && importB.source.isRelative) return 1;
  return 0;
}

export default relativesFirst;
