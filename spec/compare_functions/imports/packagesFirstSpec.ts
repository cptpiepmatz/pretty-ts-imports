import packagesFirst from "../../../src/compare_functions/imports/packagesFirst";

describe("compare_functions/imports/packagesFirst", function() {
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
