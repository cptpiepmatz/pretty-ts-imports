import ImportCompareFunction
  from "../../src/sort_rules/ImportCompareFunction";

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
