import defaultsTypesFirst from "../../../src/compare_functions/imports/defaultsTypesFirst";

describe("compare_functions/imports/defaultTypesFirst", function() {
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
