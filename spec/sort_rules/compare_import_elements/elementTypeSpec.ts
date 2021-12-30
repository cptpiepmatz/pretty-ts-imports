import ImportElement from "../../../src/import_management/ImportElement";
import elementType
  from "../../../src/sort_rules/compare_import_elements/elementType";
import expectSorted from "../../helpers/expectSorted";

describe("sort_rules/compare_import_elements/elementType", function() {

  const a = {isFunctionOrObject: true} as ImportElement;
  const B = {isFunctionOrObject: false} as ImportElement;
  const c = {isFunctionOrObject: true} as ImportElement;
  const D = {isFunctionOrObject: false} as ImportElement;

  it("should get sorted correctly", function() {
    expectSorted(a).comparedBy(elementType).toBeBefore(B);
    expectSorted(a).comparedBy(elementType).toEqual(c);
    expectSorted(a).comparedBy(elementType).toBeBefore(D);

    expectSorted(B).comparedBy(elementType).toBeAfter(a);
    expectSorted(B).comparedBy(elementType).toBeAfter(c);
    expectSorted(B).comparedBy(elementType).toEqual(D);

    expectSorted(c).comparedBy(elementType).toEqual(a);
    expectSorted(c).comparedBy(elementType).toBeBefore(B);
    expectSorted(c).comparedBy(elementType).toBeBefore(D);

    expectSorted(D).comparedBy(elementType).toBeAfter(a);
    expectSorted(D).comparedBy(elementType).toEqual(B);
    expectSorted(D).comparedBy(elementType).toBeAfter(c);
  });
});
