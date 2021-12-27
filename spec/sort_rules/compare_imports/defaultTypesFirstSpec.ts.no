/// <reference path="../../types/matchers.d.ts" />
import defaultsTypesFirst
  from "../../../src/sort_rules/compare_imports/defaultsTypesFirst";

describe("sort_rules/compare_imports/defaultTypesFirst", function() {
  const imports = [
    'import Alpha from "package";',
    'import beta from "package";'
  ];

  const expectedOutput = [
    'import Alpha from "package";',
    'import beta from "package";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, defaultsTypesFirst);
  });
});
