import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../import_management/Import";

/**
 * Simply compares the source names.
 * @param importA Import A
 * @param importB Import B
 */
const compareSources: ImportCompareFunction = function(
  importA: Import,
  importB: Import
): number {
  return importA.source.name.localeCompare(importB.source.name);
};

export default compareSources;
