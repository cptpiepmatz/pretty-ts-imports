import Import from "../../src/import_management/Import";
import {
  createSourceFile,
  ImportDeclaration,
  ScriptTarget,
  SyntaxKind
} from "typescript";
import ImportElement from "../../src/import_management/ImportElement";
import ImportElementCompareFunction
  from "../../src/sort_rules/ImportElementCompareFunction";
import FormattingOptions from "../../src/import_management/FormattingOptions";

const importedStuff = `
import {b, c, a} from "alphabet";
import element, {other} from "stuff";
import * as everything from "everything";
import {d as e} from "rename-me";
import Alpha from "./path";
import Beta from "./other-path";
import {Charlie, Delta} from "types";
`;

const superLongImported =
  'import {alfa, bravo, charlie, delta, echo, foxtrot, golf, hotel, india} from "phonetic"';

const superLongDefaultImport =
  `import SomeSuperLongDefaultImportThatMayTroublesBecauseItsThisLongOrReallyLong from "stuff";`;

const superLongSideEffectImport =
  `import "./a/path/that/is/probably/super/deep/and/therefore/not/possible/to/split/correctly";`;

describe("Import", function() {
  const sourceFile = createSourceFile("mock.ts", importedStuff, ScriptTarget.ES2021);
  const imports: Import[] = [];
  for (let statement of sourceFile.statements) {
    if (statement.kind === SyntaxKind.ImportDeclaration) {
      imports.push(new Import(statement as ImportDeclaration, sourceFile));
    }
  }

  const overflowingSourceFile =
    createSourceFile("overflow.ts", superLongImported, ScriptTarget.ES2021);
  const overflowingImport = new Import(
    overflowingSourceFile.statements[0] as ImportDeclaration,
    overflowingSourceFile
  );

  const overflowingDefaultSourcefile = createSourceFile(
    "overflowDefault.ts",
    superLongDefaultImport,
    ScriptTarget.ES2021
  );
  const overflowingDefaultImport = new Import(
    overflowingDefaultSourcefile.statements[0] as ImportDeclaration,
    overflowingDefaultSourcefile
  );

  const overflowingSideEffectSourcefile = createSourceFile(
    "overflowSideEffect.ts",
    superLongSideEffectImport,
    ScriptTarget.ES2021
  );
  const overflowingSideEffectImport = new Import(
    overflowingSideEffectSourcefile.statements[0] as ImportDeclaration,
    overflowingSideEffectSourcefile
  );

  it("should be 7 Imports", function() {
    expect(imports).toHaveSize(7);
  });

  it("should be the same output to stringify as the input", function() {
    let stringified = "\n";
    for (let importElement of imports) {
      stringified += importElement.toString() + "\n";
    }
    expect(stringified).toBe(importedStuff);
  });

  it("should be broken into multiple lines, if the import is too long", function() {
    const maxColumns = 50;
    const indent = 2;
    expect(superLongImported.length).toBeGreaterThan(maxColumns);

    let stringified = overflowingImport.toString({maxColumns, indent});
    expect(stringified.length).toBeGreaterThan(1);
    expect(stringified).toMatch(
      `
import {
  alfa,
  bravo,
  charlie,
  delta,
  echo,
  foxtrot,
  golf,
  hotel,
  india
} from "phonetic"
      `.trim()
    );

    // break at the "from" as last resort
    let stringifiedDefault = overflowingDefaultImport.toString({maxColumns, indent});
    expect(stringifiedDefault.split("\n")).toHaveSize(2);
    expect(stringifiedDefault).toMatch(`
import SomeSuperLongDefaultImportThatMayTroublesBecauseItsThisLongOrReallyLong
  from "stuff";
    `.trim());

    // finally something may not be broken down
    let stringifiedNoBreak = overflowingSideEffectImport.toString({maxColumns, indent});
    expect(stringifiedNoBreak.split("\n")).toHaveSize(1);
    expect(stringifiedNoBreak).toMatch(superLongSideEffectImport);
  });

  it("should be that imports without default imports, show these as undefined", function() {
    const importsWithoutDefault = [0, 2, 3, 6];
    for (let index of importsWithoutDefault) {
      expect(imports[index].defaultElement).toBeUndefined();
    }
  });

  it("should be that default imports are read in correctly", function() {
    const importsWithDefault = [
      {
        index: 1,
        name: "element",
        isType: false,
        isFunctionOrObject: true
      },
      {
        index: 4,
        name: "Alpha",
        isType: true,
        isFunctionOrObject: false
      },
      {
        index: 5,
        name: "Beta",
        isType: true,
        isFunctionOrObject: false
      }
    ];

    for (let element of importsWithDefault) {
      expect(imports[element.index].defaultElement).toBeDefined();
      const defaultElement =
        imports[element.index].defaultElement as ImportElement;
      expect(defaultElement.name).toBe(element.name);
      expect(defaultElement.isType).toBe(element.isType);
      expect(defaultElement.isFunctionOrObject)
        .toBe(element.isFunctionOrObject);
      expect(defaultElement.isRenamed).toBeFalse();
      expect(defaultElement.isWildcard).toBeFalse();
    }
  });

  it("should be that only imports like '* as ...' are as namespace marked", function() {
    for (let i = 0; i < imports.length; i++) {
      if (i !== 2) {
        expect(imports[i].isNamespace).toBeFalse();
        continue;
      }
      expect(imports[i].isNamespace).toBeTrue();
      const importElement = imports[i].elements[0] as ImportElement;
      expect(importElement.name).toBe("everything");
      expect(importElement.originalName).toBe("*");
      expect(importElement.isType).toBeFalse();
      expect(imports[i].elements).toHaveSize(1);
    }
  });

  it("should be that the named imports are read in correctly", function() {
    const namedImports = [
      ["b", "c", "a"],
      ["other"],
      [],
      ["d as e"],
      [],
      [],
      ["Charlie", "Delta"]
    ];

    for (let i = 0; i < imports.length; i++) {
      if (!imports[i].isNamed) continue;
      for (let j = 0; j < namedImports[i].length; j++) {
        const element = imports[i].elements[j];
        if (namedImports[i][j].includes(" as ")) {
          const splitNamed = namedImports[i][j].split(" as ");
          expect(element.originalName).toBe(splitNamed[0]);
          expect(element.name).toBe(splitNamed[1]);
          expect(element.isRenamed).toBeTrue();
        }
        else {
          expect(element.isRenamed).toBeFalse();
          expect(element.name).toBe(namedImports[i][j]);
          expect(element.originalName).toBeUndefined();
        }

        const shouldBeType = !!namedImports[i][j].match(/^[A-Z]/);
        expect(element.isType).toBe(shouldBeType);
        expect(element.isFunctionOrObject).toBe(!shouldBeType);
      }
    }
  });

  it("should get sorted", function() {
    const basicSort: ImportElementCompareFunction = function(a, b) {
      return a.name.localeCompare(b.name);
    }

    const beforeSort = 'import {b, c, a} from "alphabet";';
    const afterSort = 'import {a, b, c} from "alphabet";';
    const basicSource = createSourceFile(
      "mock.ts",
      beforeSort,
      ScriptTarget.ES2021
    );
    const basicImport = new Import(
      basicSource.statements[0] as ImportDeclaration,
      basicSource
    );

    expect(basicImport.toString()).toMatch(beforeSort);
    expect(basicImport.sort(basicSort).toString()).toMatch(afterSort);
  });

  it("should handle imports with only side-effects", function() {
    const sideEffectContent = `import "SideEffect";`;
    const sideEffectsSource = createSourceFile(
      "sideEffects.ts",
      sideEffectContent,
      ScriptTarget.ES2021
    );
    const sideEffectImport = new Import(
      sideEffectsSource.statements[0] as ImportDeclaration,
      sideEffectsSource
    );

    expect(sideEffectImport.source).toEqual(
      {name: "SideEffect", isPackage: true, isRelative: false}
    );
    expect(sideEffectImport.elements).toHaveSize(0);
    expect(sideEffectImport.toString()).toMatch(sideEffectContent);
  });

  it("should be able to stringify both quote styles", function() {
    const double: FormattingOptions = {quoteStyle: "double"};
    const single: FormattingOptions = {quoteStyle: "single"};

    expect(imports[0].toString(double)).toMatch(`import {b, c, a} from "alphabet";`);
    expect(imports[0].toString(single)).toMatch(`import {b, c, a} from 'alphabet';`);
  });

  it("should be handle to typed imports", function() {
    const typeContent = `import type {SomeThing} from "some-packages";`;
    const typeSource = createSourceFile(
      "type.ts",
      typeContent,
      ScriptTarget.ES2021
    );
    const typeImport = new Import(
      typeSource.statements[0] as ImportDeclaration,
      typeSource
    );

    expect(typeImport.toString()).toMatch(typeContent);
    expect(typeImport.isTypeOnly).toBeTrue();
  });
});
