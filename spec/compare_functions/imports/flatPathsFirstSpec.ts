import flatPathsFirst from "../../../src/compare_functions/imports/flatPathsFirst";

describe("compare_functions/imports/flatPathsFirst", function() {
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
