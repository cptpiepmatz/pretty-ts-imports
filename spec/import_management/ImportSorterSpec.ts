
import ImportSorter from "../../src/import_management/ImportSorter";
import Import from "../../src/import_management/Import";
import ImportCompareFunction from "../../src/sort_rules/ImportCompareFunction";

import * as builtinImportElementCompareFunctions
  from "../../src/sort_rules/compare_import_elements";
import * as builtinImportCompareFunctions
  from "../../src/sort_rules/compare_imports";

describe("ImportSorter", function() {

  it("should construct correctly", function() {
    const unspiedFunction = ImportSorter.inverseComparator;
    for (
      let [importName, importFunc]
      of Object.entries(builtinImportCompareFunctions)
    ) {
      for (
        let [importEName, importEFunc]
        of Object.entries(builtinImportElementCompareFunctions)
      ) {
        let inverseSpy = spyOn(ImportSorter, "inverseComparator");

        let sorter = new ImportSorter([importName], [importEName]);
        expect(sorter.sortImportOrder).toHaveSize(1);
        expect(sorter.sortImportElementOrder).toHaveSize(1);
        expect(sorter.sortImportOrder).toEqual([importFunc]);
        expect(sorter.sortImportElementOrder).toEqual([importEFunc]);

        let requiredSorter = new ImportSorter(
          [importName],
          [importEName],
          Object.assign(
            {},
            builtinImportCompareFunctions,
            builtinImportElementCompareFunctions
          )
        );
        expect(requiredSorter.sortImportOrder).toHaveSize(1);
        expect(requiredSorter.sortImportElementOrder).toHaveSize(1);
        expect(requiredSorter.sortImportOrder).toEqual([importFunc]);
        expect(requiredSorter.sortImportElementOrder).toEqual([importEFunc]);

        expect(inverseSpy).not.toHaveBeenCalled();
        let invertedSorter = new ImportSorter(
          ["!" + importName],
          ["!" + importEName]
        );
        expect(invertedSorter.sortImportOrder).toHaveSize(1);
        expect(invertedSorter.sortImportElementOrder).toHaveSize(1);
        expect(inverseSpy).toHaveBeenCalledWith(importFunc);
        expect(inverseSpy).toHaveBeenCalledWith(importEFunc);

        ImportSorter.inverseComparator = unspiedFunction;
      }
    }

    expect(() => new ImportSorter(["lol"], []))
      .toThrowError("Could not find import compare function.");

    expect(() => new ImportSorter([], ["lol"]))
      .toThrowError("Could not find import element compare function.");
  });

  it("should sort correctly", function() {
    const sort = () => {};
    const unsortedImports = [
      {source: {name: "_B"}, sort} as unknown as Import,
      {source: {name: "A"}, sort} as unknown as Import,
      {source: {name: "_A"}, sort} as unknown as Import,
      {source: {name: "B"}, sort} as unknown as Import
    ];
    const sortedImports = [
      {source: {name: "A"}, sort} as unknown as Import,
      {source: {name: "B"}, sort} as unknown as Import,
      {source: {name: "_A"}, sort} as unknown as Import,
      {source: {name: "_B"}, sort} as unknown as Import
    ];

    const alphabetical: ImportCompareFunction = function(a, b) {
      return a.source.name.localeCompare(b.source.name);
    }
    const underscoreFirst: ImportCompareFunction = function(a, b) {
      let _a = a.source.name.startsWith("_") ? 0 : 1;
      let _b = b.source.name.startsWith("_") ? 0 : 1;
      return _a - _b;
    }

    let sorter = new ImportSorter(
      ["!underscoreFirst", "alphabetical"],
      [],
      {underscoreFirst, alphabetical}
    );
    expect(sorter.sort(unsortedImports)).toEqual(sortedImports);

    let noSorter = new ImportSorter([], []);
    expect(noSorter.sort(unsortedImports)).toEqual(unsortedImports);
  });

});
