import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../import_management/Import";
import {dirname} from "path";

/**
 * Compares two paths of compare_imports.
 * Every element of the path gets compared.
 * If this returns 0 the path depth is either exhausted with no differences or
 * compare_imports share the same directory.
 * @param a Import A
 * @param b Import B
 */
const comparePaths: ImportCompareFunction = function(a, b): number {
  const dirsA = dirname(a.source.name).split("/");
  const dirsB = dirname(b.source.name).split("/");
  const minLength = Math.min(dirsA.length, dirsB.length);
  for (let i = 0; i < minLength; i++) {
    const comparison = dirsA[i].localeCompare(dirsB[i]);
    if (comparison !== 0) return comparison;
  }
  return 0;
};

export default comparePaths;
