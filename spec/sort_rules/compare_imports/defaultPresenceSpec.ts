/// <reference path="../../types/matchers.d.ts" />
import defaultPresence
  from "../../../src/sort_rules/compare_imports/defaultPresence";

describe("sort_rules/compare_imports/defaultPresence", function() {
  const imports = [
    `import {stuff} from "things";`,
    `import {a, b, c} from "alpha";`,
    `import d, {e, f} from "beta";`,
    `import random from "weird";`
  ];

  const expectedOutput = [
    `import d, {e, f} from "beta";`,
    `import random from "weird";`,
    `import {stuff} from "things";`,
    `import {a, b, c} from "alpha";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, defaultPresence);
  });
});
