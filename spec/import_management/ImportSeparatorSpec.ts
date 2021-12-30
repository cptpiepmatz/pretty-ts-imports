import ImportSeparator from "../../src/import_management/ImportSeparator";
import Import from "../../src/import_management/Import";
import unequalPackageState
  from "../../src/sort_rules/separate_by/unequalPackageState";
import SeparateByFunction from "../../src/sort_rules/SeparateByFunction";

import * as builtinSeparateByFunctions from "../../src/sort_rules/separate_by";

describe("ImportSeparator", function() {

  it("should construct correctly", function() {
    for (let [name, func] of Object.entries(builtinSeparateByFunctions)) {
      let separator = new ImportSeparator([name]);
      expect(separator.separateByRules).toHaveSize(1);
      expect(separator.separateByRules).toContain(func);
    }

    expect(() => new ImportSeparator(["lol"]))
      .toThrowError("Could not find separate by function.");

    let requireImporter = new ImportSeparator(
      ["unequalPackageState"],
      builtinSeparateByFunctions
    );
    expect(requireImporter.separateByRules).toHaveSize(1);
    expect(requireImporter.separateByRules[0]).toEqual(unequalPackageState);
  });

  it("should correctly decide when to place a separator", function() {
    const mockImports = [
      {source: {name: "A"}} as Import,
      {source: {name: "B"}} as Import,
      {source: {name: "_underscore"}} as Import,
      {source: {name: "noUnderscore"}} as Import
    ];
    const separatedImports = [
      {source: {name: "A"}} as Import,
      {source: {name: "B"}} as Import,
      null,
      {source: {name: "_underscore"}} as Import,
      null,
      {source: {name: "noUnderscore"}} as Import
    ];

    const underscore: SeparateByFunction = function(a, b) {
      let a_ = a.source.name.startsWith("_");
      let b_ = b.source.name.startsWith("_");
      return a_ !== b_;
    }
    const capital: SeparateByFunction = function(a, b) {
      let A = a.source.name.toUpperCase() == a.source.name;
      let B = b.source.name.toUpperCase() == b.source.name;
      return A !== B;
    }

    let separator = new ImportSeparator(
      ["underscore", "capital"],
      {underscore, capital}
    );
    expect(separator.insertSeparator(mockImports)).toEqual(separatedImports);
  });

});
