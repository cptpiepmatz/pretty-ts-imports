/// <reference path="../../types/matchers.d.ts" />
import sourceName from "../../../src/sort_rules/compare_imports/sourceName";

describe("sort_rules/compare_imports/sourceName", function() {
  const imports = [
    `import c from "./c";`,
    `import d from "./d";`,
    `import a from "beta";`,
    `import b from "alpha";`
  ];

  const expectedOutput = [
    `import c from "./c";`,
    `import d from "./d";`,
    `import b from "alpha";`,
    `import a from "beta";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, sourceName);
  });
});
