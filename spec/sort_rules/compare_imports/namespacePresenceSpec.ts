/// <reference path="../../types/matchers.d.ts" />
import namespacePresence
  from "../../../src/sort_rules/compare_imports/namespacePresence";

describe("sort_rules/compare_imports/namespacePresence", function() {
  const imports = [
    `import gamma from "Gamma";`,
    `import alpha from "Alpha";`,
    `import * as delta from "Delta";`,
    `import * as beta from "Beta";`,
  ];

  const expectedOutput = [
    `import * as delta from "Delta";`,
    `import * as beta from "Beta";`,
    `import gamma from "Gamma";`,
    `import alpha from "Alpha";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, namespacePresence);
  });
});
