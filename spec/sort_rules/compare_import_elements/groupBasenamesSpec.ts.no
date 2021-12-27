import createSpyObj = jasmine.createSpyObj;
import groupBasenames
  from "../../../src/sort_rules/compare_import_elements/groupBasenames";
import expectSorted from "../../helpers/expectSorted";

describe("sort_rules/compare_import_elements/groupBasenames", function() {
  it("should get sorted correctly", function() {
    const AlphaStuff = createSpyObj([], {
      name: "AlphaStuff"
    });
    const CharlieStuff = createSpyObj([], {
      name: "CharlieStuff"
    });
    const BetaItem = createSpyObj([], {
      name: "BetaItem"
    });

    expectSorted(AlphaStuff).comparedBy(groupBasenames).toBeBefore(CharlieStuff);
    expectSorted(AlphaStuff).comparedBy(groupBasenames).toBeAfter(BetaItem);
    expectSorted(CharlieStuff).comparedBy(groupBasenames).toBeAfter(AlphaStuff);
    expectSorted(CharlieStuff).comparedBy(groupBasenames).toBeAfter(BetaItem);
    expectSorted(BetaItem).comparedBy(groupBasenames).toBeBefore(AlphaStuff);
    expectSorted(BetaItem).comparedBy(groupBasenames).toBeBefore(CharlieStuff);
  });
});
