import expectSorted from "../../helpers/expectSorted";
import basenameGroup
  from "../../../src/sort_rules/compare_import_elements/basenameGroup";
import ImportElement from "../../../src/import_management/ImportElement";

describe("sort_rules/compare_import_elements/basenameGroup", function() {
  const AlphaStuff = {name: "AlphaStuff"} as ImportElement;
  const CharlieStuff = {name: "CharlieStuff"} as ImportElement;
  const BetaItem = {name: "BetaItem"} as ImportElement;
  const OtherBetaItem = {name: "BetaItem"} as ImportElement;
  const deltaObject = {isFunctionOrObject: true} as ImportElement;

  it("should get sorted correctly", function() {
    expectSorted(AlphaStuff).comparedBy(basenameGroup).toBeBefore(CharlieStuff);
    expectSorted(AlphaStuff).comparedBy(basenameGroup).toBeAfter(BetaItem);
    expectSorted(CharlieStuff).comparedBy(basenameGroup).toBeAfter(AlphaStuff);
    expectSorted(CharlieStuff).comparedBy(basenameGroup).toBeAfter(BetaItem);
    expectSorted(BetaItem).comparedBy(basenameGroup).toBeBefore(AlphaStuff);
    expectSorted(BetaItem).comparedBy(basenameGroup).toBeBefore(CharlieStuff);
    expectSorted(BetaItem).comparedBy(basenameGroup).toEqual(OtherBetaItem);
    expectSorted(deltaObject).comparedBy(basenameGroup).toEqual(AlphaStuff);
    expectSorted(AlphaStuff).comparedBy(basenameGroup).toEqual(deltaObject);
  });
});
