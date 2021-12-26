import ImportCompareFunction from "../sort_rules/ImportCompareFunction";
import {
  builtinImportCompareFunctions,
  builtinImportElementCompareFunctions
} from "../sort_rules/builtins";
import ImportElementCompareFunction
  from "../sort_rules/ImportElementCompareFunction";
import Import from "./Import";
import {RequiredFunction} from "../config";
import InvalidConfigError from "../errors/InvalidConfigError";

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
    for (let sortImport of sortImports) {
      if (!importCompareFunctions[sortImport]) {
        throw new InvalidConfigError(
          "Could not find import compare function.",
          "sortImports",
          sortImport
        );
      }
      this.sortImportOrder.push(importCompareFunctions[sortImport]);
    }

    // tries to order the compare functions by the config
    for (let sortImportElement of sortImportElements) {
      if (!importElementCompareFunctions[sortImportElement]) {
        throw new InvalidConfigError(
          "Could not find import element compare function.",
          "sortImportElement",
          sortImportElement
        );
      }
      this.sortImportElementOrder
        .push(importElementCompareFunctions[sortImportElement]);
    }
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
