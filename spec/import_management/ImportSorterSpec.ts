import createSpy = jasmine.createSpy;
import createSpyObj = jasmine.createSpyObj;
import Spy = jasmine.Spy;
import Import from "../../src/import_management/Import";
import ImportCompareFunction
  from "../../src/sort_rules/ImportCompareFunction";
import ImportElementCompareFunction
  from "../../src/sort_rules/ImportElementCompareFunction";
import ImportSorter from "../../src/import_management/ImportSorter";

describe("ImportSorterSpec", function() {
  const imported: Import = createSpyObj(["sort"]);
  imported.sort = createSpy().and
    .callFake((compareFn: Function) => compareFn());

  it(
    "should execute compare functions in the correct order",
    function() {
      const compareImports0: ImportCompareFunction =
        createSpy().and.returnValue(0);
      const compareImports1: ImportCompareFunction =
        createSpy().and.returnValue(0);
      const compareImportElements0: ImportElementCompareFunction =
        createSpy().and.returnValue(0);
      const compareImportElements1: ImportElementCompareFunction =
        createSpy().and.returnValue(0);

      const sorter = new ImportSorter({
        imports: [compareImports0, compareImports1],
        importElements: [compareImportElements0, compareImportElements1]
      });

      expect(compareImports0).not.toHaveBeenCalled();
      expect(compareImports1).not.toHaveBeenCalled();
      expect(compareImportElements0).not.toHaveBeenCalled();
      expect(compareImportElements1).not.toHaveBeenCalled();

      sorter.sort([imported, imported]);

      expect(compareImports0).toHaveBeenCalled();
      expect(compareImports1).toHaveBeenCalled();
      expect(compareImports0).toHaveBeenCalledBefore(compareImports1);
      expect(compareImportElements0).toHaveBeenCalled();
      expect(compareImportElements1).toHaveBeenCalled();
    }
  );

  it("should execute compare functions only if necessary", function() {
    const fallThrough: ImportCompareFunction & Spy =
      createSpy().and.returnValue(0);
    const larger: ImportCompareFunction & Spy =
      createSpy().and.returnValue(1);
    const fallThroughElement: ImportElementCompareFunction & Spy =
      createSpy().and.returnValue(0);
    const largerElement: ImportElementCompareFunction & Spy =
      createSpy().and.returnValue(1);

    const sorter0 = new ImportSorter({
      imports: [larger, fallThrough],
      importElements: [largerElement, fallThroughElement]
    });

    const sorter1 = new ImportSorter({
      imports: [fallThrough, larger],
      importElements: [fallThroughElement, largerElement]
    });

    expect(fallThrough).not.toHaveBeenCalled();
    expect(larger).not.toHaveBeenCalled();
    expect(fallThroughElement).not.toHaveBeenCalled();
    expect(largerElement).not.toHaveBeenCalled();

    sorter0.sort([imported, imported]);

    expect(fallThrough).not.toHaveBeenCalled();
    expect(larger).toHaveBeenCalled();
    expect(fallThroughElement).not.toHaveBeenCalled();
    expect(largerElement).toHaveBeenCalled();

    fallThrough.calls.reset();
    larger.calls.reset();
    fallThroughElement.calls.reset();
    largerElement.calls.reset();

    sorter1.sort([imported, imported]);

    expect(fallThrough).toHaveBeenCalled();
    expect(larger).toHaveBeenCalled();
    expect(fallThroughElement).toHaveBeenCalled();
    expect(largerElement).toHaveBeenCalled();
  });
});
