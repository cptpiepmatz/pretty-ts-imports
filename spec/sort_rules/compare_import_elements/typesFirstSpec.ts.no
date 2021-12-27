import createSpyObj = jasmine.createSpyObj;
import typesFirst
  from "../../../src/sort_rules/compare_import_elements/typesFirst";
import expectSorted from "../../helpers/expectSorted";

describe("sort_rules/compare_import_elements/typesFirst", function() {
  it("should get sorted correctly", function() {
    const typeElement = createSpyObj([], {
      isType: true,
      isFunctionOrObject: false
    });
    const objectElement = createSpyObj([], {
      isType: false,
      isFunctionOrObject: true
    });

    expectSorted(typeElement).comparedBy(typesFirst).toBeBefore(objectElement);
    expectSorted(objectElement).comparedBy(typesFirst).toBeAfter(typeElement);
    expectSorted(typeElement).comparedBy(typesFirst).toEqual(typeElement);
    expectSorted(objectElement).comparedBy(typesFirst).toEqual(objectElement);
  });
});
