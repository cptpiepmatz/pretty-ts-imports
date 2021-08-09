import ImportCompareFunction from "../ImportCompareFunction";
import Import from "../../import_management/Import";

/**
 * If the two compare_imports use the default import.
 * It checks if the imported elements both are a type.
 * If so, compare them from the back to the front.
 * @example
 *    [AlphaStuff, BetaStuff, CharlieItem]
 * => [CharlieItem, AlphaStuff, BetaStuff]
 * @param a Import A
 * @param b Import B
 */
const defaultsCompareTypes: ImportCompareFunction = function(a, b): number {
  if (a.defaultElement?.isType && b.defaultElement?.isType) {
    const partNamesA = extractPartNames(a.defaultElement.name).reverse();
    const partNamesB = extractPartNames(b.defaultElement.name).reverse();
    const minPartNamesLength = Math.min(partNamesA.length, partNamesB.length);
    for (let i = 0; i < minPartNamesLength; i++) {
      const comparison = partNamesA[i].localeCompare(partNamesB[i]);
      if (comparison !== 0) return comparison;
    }
  }
  return 0;
};

/**
 * Extracts the parts from a name separating by their capital letters.
 * @example
 * "AlphaBetaCharlie" => ["Alpha", "Beta", "Charlie"]
 * @param fullName The full name that needs to be splitten apart
 */
function extractPartNames(fullName: string): string[] {
  const partNames: string[] = [];
  fullName.split(/([A-Z])/).slice(1).forEach((element, index, array) => {
    if (index % 2 === 0) return;
    partNames.push(array[index - 1] + element);
  });
  return partNames;
}

export default defaultsCompareTypes;
