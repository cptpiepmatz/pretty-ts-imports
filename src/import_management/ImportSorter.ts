import ImportCompareFunction from "../compare_functions/ImportCompareFunction";
import Import from "./Import";
import ImportElementCompareFunction
  from "../compare_functions/ImportElementCompareFunction";

/** Class used to sort imports. To construct it, you need sort rules. */
export default class ImportSorter {

  /**
   * Constructor.
   * Stores all the given sort rules to sort later on.
   * @param sortRules Object holding compare functions with decreasing priority
   */
  constructor(
    private sortRules: {
      imports: ImportCompareFunction[],
      importElements: ImportElementCompareFunction[]
    }
  ) {}

  /**
   * Iterate through every compare function of the sort rules.
   * @param importA Import A
   * @param importB Import B
   * @private
   */
  private compare = this.compareBuilder(this.sortRules.imports);

  /**
   * Iterate through evey compare of the sort rules.
   * This is used to sort the elements inside an import statement.
   * @param importElementA Import element A
   * @param importElementB Import element B
   * @private
   */
  private compareElements = this.compareBuilder(this.sortRules.importElements);

  /**
   * Builds a compare function from an array of compare functions.
   * The order of the array sets the priority.
   * @param compareFunctions Functions to iterate through
   * @private
   */
  private compareBuilder<T>(
    compareFunctions: ((A: T, B: T) => number)[]
  ): (compareA: T, compareB: T) => number {
    return ((compareA, compareB) => {
      for (let compareFunction of compareFunctions) {
        const comparison = compareFunction(compareA, compareB);
        if (comparison !== 0) return comparison;
      }
      return 0;
    });
  }

  /**
   * Sorts the given Import objects in-place according to the sort rules.
   * This also returns the newly sorted array.
   * @param imports Import objects to sort.
   */
  sort(imports: Import[]): Import[] {
    imports.sort(this.compare);
    for (let imported of imports) {
      imported.sort(this.compareElements);
    }
    return imports;
  }
}
