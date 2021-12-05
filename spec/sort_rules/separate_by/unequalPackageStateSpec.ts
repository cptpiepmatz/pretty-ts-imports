import createSpyObj = jasmine.createSpyObj;
import separator from "../../../src/sort_rules/separate_by/unequalPackageState";
import expectSeparator from "../../helpers/expectSeparator";

describe("sort_rules/separate_by/unequalsPackageState", function() {
  it("should set the separator correctly", function() {
    const packageImport = createSpyObj([], {
      source: {
        isPackage: true,
        isRelative: false
      }
    });
    const relativeImport = createSpyObj([], {
      source: {
        isPackage: false,
        isRelative: true
      }
    });

    expectSeparator(separator).between(packageImport).and(relativeImport);
    expectSeparator(separator).between(relativeImport).and(packageImport);
    expectSeparator(separator).not.between(packageImport).and(packageImport);
    expectSeparator(separator).not.between(relativeImport).and(relativeImport);
  });
});
