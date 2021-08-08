/// <reference path="../../types/matchers.d.ts" />
import deepPathsFirst
  from "../../../src/compare_functions/imports/deepPathsFirst";

describe("compare_functions/imports/deepPathsFirst", function() {
  const imports = [
    'import elements from "a/b/c/d";',
    'import elements from "a/b/c";',
    'import elements from "a/b/c/d";',
    'import elements from "b/b/b/b/b";'
  ];

  const expectedOutput = [
    'import elements from "b/b/b/b/b";',
    'import elements from "a/b/c/d";',
    'import elements from "a/b/c/d";',
    'import elements from "a/b/c";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, deepPathsFirst);
  });
});
