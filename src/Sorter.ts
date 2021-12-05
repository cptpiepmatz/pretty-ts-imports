import ImportCompareFunction from "./sort_rules/ImportCompareFunction";
import {
  builtinImportCompareFunctions
} from "./sort_rules/builtins/builtinImportCompareFunctions";
import ImportElementCompareFunction
  from "./sort_rules/ImportElementCompareFunction";
import {
  builtinImportElementCompareFunctions
} from "./sort_rules/builtins/builtinImportElementCompareFunctions";
import Import from "./import_management/Import";

export default class Sorter {
  // TODO: document me
  // TODO: test me

  readonly sortImportOrder: ImportCompareFunction[] = [];
  readonly sortImportElementOrder: ImportElementCompareFunction[] = [];

  constructor(
    sortImports: string[],
    sortImportElements: string[]
  );
  constructor(
    sortImports: string[],
    sortImportElements: string[],
    configPath: string,
    requireFunctions: Record<string, string>
  );
  constructor(
    sortImports: string[],
    sortImportElements: string[],
    configPath?: string,
    requireFunctions?: Record<string, string>
  ) {
    for (let sortImport of sortImports) {
      if (!builtinImportCompareFunctions[sortImport]) {
        throw new Error("Could not find import compare function: " + sortImport);
      }
      this.sortImportOrder.push(builtinImportCompareFunctions[sortImport]);
    }

    for (let sortImportElement of sortImportElements) {
      if (!builtinImportElementCompareFunctions[sortImportElement]) {
        throw new Error("Could not find import element compare function: " + sortImportElement);
      }
      this.sortImportElementOrder
        .push(builtinImportElementCompareFunctions[sortImportElement]);
    }

    // TODO: work out the external functions
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
    const importCompare = Sorter.chainCompareFunctions(this.sortImportOrder);
    const importElementCompare =
      Sorter.chainCompareFunctions(this.sortImportElementOrder);

    for (let imported of imports) {
      imported.sort(importElementCompare);
    }
    return imports.sort(importCompare);
  }
}
