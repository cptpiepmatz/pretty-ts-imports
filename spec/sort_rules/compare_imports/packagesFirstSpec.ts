/// <reference path="../../types/matchers.d.ts" />
import packagesFirst
  from "../../../src/sort_rules/compare_imports/packagesFirst";

describe("sort_rules/compare_imports/packagesFirst", function() {
  const imports = [
    'import elements from "./path";',
    'import elements from "package";'
  ];

  const expectedOutput = [
    'import elements from "package";',
    'import elements from "./path";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, packagesFirst);
  });
});
