import Import from "../../../src/import_management/Import";
import separator from "../../../src/sort_rules/separate_by/unequalPackageState";
import expectSeparator from "../../helpers/expectSeparator";

describe("sort_rules/separate_by/unequalsPackageState", function() {
  const packageImport = {
    source: {
      isPackage: true,
      isRelative: false
    }
  } as Import;

  const relativeImport = {
    source: {
      isPackage: false,
      isRelative: true
    }
  } as Import;

  it("should set the separator correctly", function() {
    expectSeparator(separator).between(packageImport).and(relativeImport);
    expectSeparator(separator).between(relativeImport).and(packageImport);
    expectSeparator(separator).not.between(packageImport).and(packageImport);
    expectSeparator(separator).not.between(relativeImport).and(relativeImport);
  });
});
