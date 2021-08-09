/// <reference path="../../types/matchers.d.ts" />
import flatPathsFirst
  from "../../../src/sort_rules/compare_imports/flatPathsFirst";

describe("sort_rules/compare_imports/flatPathsFirst", function() {
  const imports = [
    'import elements from "a/b/c/d";',
    'import elements from "a/b/c";',
    'import elements from "a/b/c/d";',
    'import elements from "b/b/b/b/b";'
  ];

  const expectedOutput = [
    'import elements from "a/b/c";',
    'import elements from "a/b/c/d";',
    'import elements from "a/b/c/d";',
    'import elements from "b/b/b/b/b";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, flatPathsFirst);
  });
});