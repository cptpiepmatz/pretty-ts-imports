/// <reference path="../../types/matchers.d.ts" />
import compareSources
  from "../../../src/sort_rules/compare_imports/compareSources";

describe("sort_rules/compare_imports/compareSources", function() {
  const imports = [
    'import elements from "abc";',
    'import elements from "aaa";',
    'import elements from "ccc";'
  ];

  const expectedOutput = [
    'import elements from "aaa";',
    'import elements from "abc";',
    'import elements from "ccc";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, compareSources);
  });
});
