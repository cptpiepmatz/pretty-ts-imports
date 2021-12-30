import Import from "./Import";
import InvalidConfigError from "../errors/InvalidConfigError";
import ImportCompareFunction from "../sort_rules/ImportCompareFunction";
import ImportElementCompareFunction
  from "../sort_rules/ImportElementCompareFunction";
import {RequiredFunction} from "../config";

import * as builtinImportCompareFunctions from "../sort_rules/compare_imports";
import * as builtinImportElementCompareFunctions
  from "../sort_rules/compare_import_elements";

/** Class for sorting imports and the import elements. */
export default class ImportSorter {

  /**
   * Array of import compare functions.
   * The order of elements is important here.
   */
  readonly sortImportOrder: ImportCompareFunction[] = [];
  /**
   * Array of import element compare functions.
   * The order of elements is important here.
   */
  readonly sortImportElementOrder: ImportElementCompareFunction[] = [];

  /**
   * Constructor
   * @param sortImports Array of compare function names
   * @param sortImportElements Array of compare function names
   * @param requireFunctions Record of external functions mapped by their names
   */
  constructor(
    sortImports: string[],
    sortImportElements: string[],
    requireFunctions?: Record<string, RequiredFunction>
  ) {
    // merges the builtin compare functions with the external ones
    const importCompareFunctions = Object.assign(
      {},
      builtinImportCompareFunctions,
      requireFunctions
    ) as Record<string, ImportCompareFunction>;

    // merges the builtin compare functions with the external ones
    const importElementCompareFunctions = Object.assign(
      {},
      builtinImportElementCompareFunctions,
      requireFunctions
    ) as Record<string, ImportElementCompareFunction>;

    // tries to order the compare functions by the config
    for (
      let [sortImport, shouldInverse]
      of sortImports.map(ImportSorter.shouldInverse)
    ) {
      if (!importCompareFunctions[sortImport]) {
        throw new InvalidConfigError(
          "Could not find import compare function.",
          "sortImports",
          {sortImport, shouldInverse}
        );
      }
      if (shouldInverse) {
        this.sortImportOrder.push(
          ImportSorter.inverseComparator(importCompareFunctions[sortImport])
        );
      }
      else {
        this.sortImportOrder.push(importCompareFunctions[sortImport]);
      }
    }

    // tries to order the compare functions by the config
    for (
      let [sortImportElement, shouldInverse]
      of sortImportElements.map(ImportSorter.shouldInverse)
    ) {
      if (!importElementCompareFunctions[sortImportElement]) {
        throw new InvalidConfigError(
          "Could not find import element compare function.",
          "sortImportElement",
          {sortImportElement, shouldInverse}
        );
      }
      if (shouldInverse) {
        this.sortImportElementOrder
          .push(ImportSorter.inverseComparator(
            importElementCompareFunctions[sortImportElement])
          );
      }
      else {
        this.sortImportElementOrder
          .push(importElementCompareFunctions[sortImportElement]);
      }

    }
  }

  /**
   * Helper function to get the rule name and if it should get inverted.
   *
   * A "!" prepending the sort rule indicates inverting it.
   * @param rule The name of a sort rule given from the config
   * @private
   */
  private static shouldInverse(rule: string): [string, boolean] {
    return rule.startsWith("!") ? [rule.slice(1), true] : [rule, false];
  }

  /**
   * Function to chain compare functions together.
   * @param sortRules An array of compare functions for the same type
   * @returns A new compare function running through every compare function
   * until it finds a non 0 value
   */
  static chainCompareFunctions<T>(sortRules: ((a: T, b: T) => number)[]):
    (a: T, b: T) => number
  {
    return function(a: T, b: T): number {
      for (let rule of sortRules) {
        let result = rule(a, b);
        if (result !== 0) return result;
      }
      return 0;
    }
  }

  /**
   * Helper function to get the inverse of a comparator function.
   * Since comparator functions simply return numbers, this just returns the
   * negation of them.
   * @returns inverse of a comparator function
   * @param comparator comparator function
   */
  static inverseComparator<T>(
    comparator: ((a: T, b: T) => number)
  ): (a: T, b:T) => number {
    return function(a: T, b: T): number {
      return -comparator(a, b);
    }
  }

  /**
   * Sorts all imports according to the given sort rules.
   * @param imports Array of imports
   * @returns Array of sorted imports
   */
  sort(imports: Import[]): Import[] {
    const importCompare = ImportSorter.chainCompareFunctions(this.sortImportOrder);
    const importElementCompare =
      ImportSorter.chainCompareFunctions(this.sortImportElementOrder);

    for (let imported of imports) {
      imported.sort(importElementCompare);
    }
    return imports.sort(importCompare);
  }
}
