import Import from "../../../src/import_management/Import";
import separator from "../../../src/sort_rules/separate_by/unequalSideEffectUse";
import expectSeparator from "../../helpers/expectSeparator";

describe("sort_rules/separate_by/unequalsSideEffectUse", function() {
  const sideEffect = {isSideEffectOnly: true} as Import;
  const noSideEffect = {isSideEffectOnly: false} as Import;

  it("should set the separator correctly", function() {
    expectSeparator(separator).between(sideEffect).and(noSideEffect);
    expectSeparator(separator).between(noSideEffect).and(sideEffect);
    expectSeparator(separator).not.between(sideEffect).and(sideEffect);
    expectSeparator(separator).not.between(noSideEffect).and(noSideEffect);
  });
});
