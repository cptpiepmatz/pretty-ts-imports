import Import from "../src/Import";
import {createSourceFile, ImportDeclaration, ScriptTarget, SyntaxKind} from "typescript";

const importedStuff = `
import {b, c, a} from "alphabet";
import element, {other} from "stuff";
import * as everything from "everything";
import {d as e} from "rename-me";
import Alpha from "./path";
import Beta from "./other-path";
import {Charlie, Delta} from "types";
`

describe("Import", function() {
  const sourceFile = createSourceFile("mock.ts", importedStuff, ScriptTarget.ES2021);
  const imports: Import[] = [];
  for (let statement of sourceFile.statements) {
    if (statement.kind === SyntaxKind.ImportDeclaration) {
      imports.push(new Import(statement as ImportDeclaration, sourceFile));
    }
  }

  it("should be 7 Imports", function() {
    expect(imports.length).toEqual(7);
  });

  it("should be same output to stringify as the input", function() {
    let stringified = "\n";
    for (let importElement of imports) {
      stringified += importElement.toString() + "\n";
    }
    expect(stringified).toEqual(importedStuff);
  });
});
