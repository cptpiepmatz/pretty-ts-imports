/// <reference path="../../types/matchers.d.ts" />
import pathDepth from "../../../src/sort_rules/compare_imports/pathDepth";

describe("sort_rules/compare_imports/pathDepth", function() {
  const imports = [
    `import c from "PackageC";`,
    `import d from "PackageD";`,
    `import a from "./longer/path";`,
    `import b from "./short-path";`
  ];

  const expectedOutput = [
    `import c from "PackageC";`,
    `import d from "PackageD";`,
    `import b from "./short-path";`,
    `import a from "./longer/path";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, pathDepth);
  });
});
