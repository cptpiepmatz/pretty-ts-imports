import {
  builtinImportCompareFunctions,
  builtinImportElementCompareFunctions
} from "../../src/sort_rules/builtins";
import ImportSorter from "../../src/import_management/ImportSorter";
import Import from "../../src/import_management/Import";
import ImportCompareFunction from "../../src/sort_rules/ImportCompareFunction";

describe("ImportSorter", function() {

  it("should construct correctly", function() {
    for (let [importName, importFunc]
      of Object.entries(builtinImportCompareFunctions)) {
      for (let [importEName, importEFunc]
        of Object.entries(builtinImportElementCompareFunctions)) {
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
        expect(sorter.sortImportOrder).toHaveSize(1);
        expect(sorter.sortImportElementOrder).toHaveSize(1);
        expect(sorter.sortImportOrder).toEqual([importFunc]);
        expect(sorter.sortImportElementOrder).toEqual([importEFunc]);
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
    const underscoreLast: ImportCompareFunction = function(a, b) {
      let _a = a.source.name.startsWith("_") ? 1 : 0;
      let _b = b.source.name.startsWith("_") ? 1 : 0;
      return _a - _b;
    }

    let sorter = new ImportSorter(
      ["underscoreLast", "alphabetical"],
      [],
      {underscoreLast, alphabetical}
    );
    expect(sorter.sort(unsortedImports)).toEqual(sortedImports);

    let noSorter = new ImportSorter([], []);
    expect(noSorter.sort(unsortedImports)).toEqual(unsortedImports);
  });

});
