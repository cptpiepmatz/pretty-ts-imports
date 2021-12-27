/// <reference path="../../types/matchers.d.ts" />
import comparePaths from "../../../src/sort_rules/compare_imports/comparePaths";

describe("sort_rules/compare_imports/comparePaths", function() {
  const imports = [
    'import elements from "abc/def/hij";',
    'import elements from "abc/abc/abc";',
    'import elements from "aab/abc/ghi";',
    'import elements from "zz/aaa";'
  ];

  const expectedOutput = [
    'import elements from "aab/abc/ghi";',
    'import elements from "abc/abc/abc";',
    'import elements from "abc/def/hij";',
    'import elements from "zz/aaa";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, comparePaths);
  });
});
