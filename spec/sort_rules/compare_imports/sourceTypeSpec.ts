/// <reference path="../../types/matchers.d.ts" />
import sourceType from "../../../src/sort_rules/compare_imports/sourceType";

describe("sort_rules/compare_imports/sourceType", function() {
  const imports = [
    `import d from "./Delta";`,
    `import b from "./Beta";`,
    `import c from "Gamma";`,
    `import a from "Alpha";`
  ];

  const expectedOutput = [
    `import c from "Gamma";`,
    `import a from "Alpha";`,
    `import d from "./Delta";`,
    `import b from "./Beta";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, sourceType);
  });
});
