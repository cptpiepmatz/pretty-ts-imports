/// <reference path="../../types/matchers.d.ts" />
import pathName from "../../../src/sort_rules/compare_imports/pathName";

describe("sort_rules/compare_imports/pathName", function() {
  const imports = [
    `import e from "e";`,
    `import f from "f";`,
    `import c from "./alpha-beta/alpha/c";`,
    `import b from "./alpha/gamma/b";`,
    `import a from "./alpha/beta/a";`,
    `import d from "./alpha/beta/d";`
  ];

  const expectedOutput = [
    `import e from "e";`,
    `import f from "f";`,
    `import a from "./alpha/beta/a";`,
    `import d from "./alpha/beta/d";`,
    `import b from "./alpha/gamma/b";`,
    `import c from "./alpha-beta/alpha/c";`
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, pathName);
  });
});
