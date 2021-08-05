import ImportCompareFunction from "../../src/compare_functions/ImportCompareFunction";
import Import from "../../src/import_management/Import";
import {createSourceFile, ImportDeclaration, ScriptTarget, SyntaxKind} from "typescript";
import CustomMatcher = jasmine.CustomMatcher;
import CustomMatcherResult = jasmine.CustomMatcherResult;

declare global {
  namespace jasmine {
    interface Matchers<T> {
      toBeImportSorted(
        expected: string[],
        compareFunction: ImportCompareFunction
      ): boolean;
    }
  }
}

beforeEach(function() {
  jasmine.addMatchers({
    toBeImportSorted: function(): CustomMatcher {
      // matcher reading in import string, converting them to import objects
      // and sorting them via the compare function
      return {
        compare: function(
          actual: string[],
          expected: string[],
          compareFunction: ImportCompareFunction
        ): CustomMatcherResult {
          const imports: Import[] = [];
          for (let actualElement of actual) {
            const sourceFile = createSourceFile(
              "mock.ts", actualElement, ScriptTarget.ES2021
            );
            for (let statement of sourceFile.statements) {
              if (statement.kind === SyntaxKind.ImportDeclaration) {
                imports.push(
                  new Import(statement as ImportDeclaration, sourceFile)
                );
              }
            }
          }

          if (imports.length !== expected.length) {
            return {
              message: `Expected ${expected.length} imports, but only got ${imports.length}`,
              pass: false
            }
          }

          imports.sort(compareFunction);

          let pass = true;
          for (let i = 0; i < actual.length; i++) {
            if (imports[i].toString() !== expected[i]) pass = false;
          }
          return {pass: pass}
        }
      }
    }
  })
});
