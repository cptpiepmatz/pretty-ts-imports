/// <reference path="../../types/matchers.d.ts" />
import namespaceBeforeNamed
  from "../../../src/sort_rules/compare_imports/namespaceBeforeNamed";

describe("sort_rules/compare_imports/namespaceBeforeNamed", function() {
  const imports = [
    'import {stuff} from "package";',
    'import * as stuff from "package";'
  ];

  const expectedOutput = [
    'import * as stuff from "package";',
    'import {stuff} from "package";'
  ];

  it("should get sorted correctly", function() {
    expect(imports).toBeImportSorted(expectedOutput, namespaceBeforeNamed);
  });
});
