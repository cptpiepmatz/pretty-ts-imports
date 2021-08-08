/// <reference path="../../types/matchers.d.ts" />
import defaultsCompareTypes
  from "../../../src/sort_rules/imports/defaultsCompareTypes";

describe("sort_rules/imports/defaultCompareTypes", function() {
  const imports = [
    'import AlphaStuff from "package";',
    'import BetaStuff from "package";',
    'import CharlieItem from "package";'
  ];

  const expectedOutput = [
    'import CharlieItem from "package";',
    'import AlphaStuff from "package";',
    'import BetaStuff from "package";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, defaultsCompareTypes);
  });
});
