import Import from "../../../src/import_management/Import";
import separator from "../../../src/sort_rules/separate_by/unequalNamespaceUse";
import expectSeparator from "../../helpers/expectSeparator";

describe("sort_rules/separate_by/unequalsNamespaceUse", function() {
  const namespaceImport = {isNamespace: true} as Import;
  const noNamespaceImport = {isNamespace: false} as Import;

  it("should set the separator correctly", function() {
    expectSeparator(separator).between(namespaceImport).and(noNamespaceImport);
    expectSeparator(separator).between(noNamespaceImport).and(namespaceImport);
    expectSeparator(separator).not.between(namespaceImport).and(namespaceImport);
    expectSeparator(separator).not.between(noNamespaceImport).and(noNamespaceImport);
  });
});
