import FormattingOptions from "../../src/import_management/FormattingOptions";
import ImportIntegrator from "../../src/import_management/ImportIntegrator";
import {createSourceFile, ImportDeclaration, ScriptTarget} from "typescript";
import Import from "../../src/import_management/Import";

describe("ImportIntegrator", function() {

  const formatting: FormattingOptions = {
    indent: 2,
    bracketIndent: 0,
    quoteStyle: "double",
    maxColumns: 80
  }

  const sourceWithImportsContent = `
import a from "A";
import b from "B";

console.log(a);
console.log(b);
  `.trim();
  const sourceWithImports = createSourceFile(
    "a.ts",
    sourceWithImportsContent,
    ScriptTarget.ES2021
  );

  const brokenSourceContent = `
import a as stuff from "A";

console.log(stuff);
  `.trim();
  const brokenSource = createSourceFile(
    "broken.ts",
    brokenSourceContent,
    ScriptTarget.ES2021
  );

  const sourceNoImportsContent = "console.log(a);";
  const sourceNoImports = createSourceFile(
    "no.ts",
    sourceNoImportsContent,
    ScriptTarget.ES2021
  );

  const importA = new Import(
    sourceWithImports.statements[0] as ImportDeclaration,
    sourceWithImports
  );
  const importB = new Import(
    sourceWithImports.statements[1] as ImportDeclaration,
    sourceWithImports
  );


  it("should integrate the imports correctly", function() {
    const integrator = new ImportIntegrator(formatting);

    let integratedAB = integrator.integrate(
      sourceWithImports,
      [importA, importB]
    );
    expect(integratedAB).toEqual(sourceWithImportsContent);

    let integratedBA = integrator.integrate(
      sourceWithImports,
      [importB, importA]
    );
    expect(integratedBA).toEqual(`
import b from "B";
import a from "A";

console.log(a);
console.log(b);
    `.trim());

    let integratedANullB = integrator.integrate(
      sourceWithImports,
      [importA, null, importB]
    );
    expect(integratedANullB).toEqual(`
import a from "A";

import b from "B";

console.log(a);
console.log(b);
    `.trim());

    expect(() => integrator.integrate(
      brokenSource,
      [importA, importB]
    )).toThrowError("Couldn't find the end of imports");

    expect(integrator.integrate(sourceNoImports, []))
      .toEqual(sourceNoImportsContent);
  });

});
