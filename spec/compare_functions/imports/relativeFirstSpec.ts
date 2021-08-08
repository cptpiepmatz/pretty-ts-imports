/// <reference path="../../types/matchers.d.ts" />
import relativesFirst
  from "../../../src/compare_functions/imports/relativesFirst";

describe("compare_functions/imports/relativesFirst", function() {
  const imports = [
    'import elements from "package";',
    'import elements from "./path";'
  ];

  const expectedOutput = [
    'import elements from "./path";',
    'import elements from "package";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, relativesFirst);
  });
});
