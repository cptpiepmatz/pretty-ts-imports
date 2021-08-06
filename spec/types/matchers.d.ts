import ImportCompareFunction from "../../src/compare_functions/ImportCompareFunction";

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeImportSorted(
        expected: string[],
        compareFunction: ImportCompareFunction
      ): boolean;
    }
  }
}
