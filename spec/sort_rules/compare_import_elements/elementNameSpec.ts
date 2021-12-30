import ImportElement from "../../../src/import_management/ImportElement";
import elementName
  from "../../../src/sort_rules/compare_import_elements/elementName";
import expectSorted from "../../helpers/expectSorted";

describe("sort_rules/compare_import_elements/elementName", function() {

  const a = {name: "a"} as ImportElement;
  const b = {name: "b"} as ImportElement;
  const c = {name: "c"} as ImportElement;

  it("should get sorted correctly", function() {
    expectSorted(a).comparedBy(elementName).toBeBefore(b);
    expectSorted(a).comparedBy(elementName).toBeBefore(c);

    expectSorted(b).comparedBy(elementName).toBeAfter(a);
    expectSorted(b).comparedBy(elementName).toBeBefore(c);

    expectSorted(c).comparedBy(elementName).toBeAfter(a);
    expectSorted(c).comparedBy(elementName).toBeAfter(b);
  });
});
