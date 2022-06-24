/// <reference path="../../types/matchers.d.ts" />
import sideEffect
  from "../../../src/sort_rules/compare_imports/sideEffect";

describe("sort_rules/compare_imports/sideEffect", function() {
  const imports = [
    `import a from "alpha";`,
    `import "beta";`,
    `import c from "charlie";`,
    `import "delta";`
  ];

  const expectedOutput = [
    `import "beta";`,
    `import "delta";`,
    `import a from "alpha";`,
    `import c from "charlie";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, sideEffect);
  });
});
