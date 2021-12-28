/// <reference path="../../types/matchers.d.ts" />
import defaultType from "../../../src/sort_rules/compare_imports/defaultType";

describe("sort_rules/compare_imports/defaultType", function() {
  const imports = [
    `import {gamma} from "Gamma";`,
    `import alpha from "Alpha";`,
    `import Beta from "Beta";`,
    `import Delta from "Delta";`,
    `import epsilon from "Epsilon";`
  ];

  const expectedOutput = [
    `import {gamma} from "Gamma";`,
    `import Beta from "Beta";`,
    `import Delta from "Delta";`,
    `import alpha from "Alpha";`,
    `import epsilon from "Epsilon";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, defaultType);
  });
});
