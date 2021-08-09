import createSpyObj = jasmine.createSpyObj;
import divider from "../../../src/sort_rules/divide_by/unequalPackageState";
import expectDivider from "../../helpers/expectDivider";

describe("sort_rules/divide_by/unequalsPackageState", function() {
  it("should set the divider correctly", function() {
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

    expectDivider(divider).between(packageImport).and(relativeImport);
    expectDivider(divider).between(relativeImport).and(packageImport);
    expectDivider(divider).not.between(packageImport).and(packageImport);
    expectDivider(divider).not.between(relativeImport).and(relativeImport);
  });
});
