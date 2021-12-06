import FormattingOptions from "./import_management/FormattingOptions";
import Import from "./import_management/Import";
import {SourceFile, SyntaxKind} from "typescript";

export default class Integrator {

  private readonly formatting: FormattingOptions;

  constructor(formatting: FormattingOptions) {
    this.formatting = formatting;
  }

  private stringifyImports(imports: (Import | null)[]) {
    let output = "";
    for (let imported of imports) {
      if (imported === null) output += "\n";
      else output += imported.toString(this.formatting) + "\n";
    }
    return output.slice(0, -1);
  }

  integrate(sourceFile: SourceFile, imports: (Import | null)[]): string {
    let importStart = sourceFile.text.search(/^import\s/gm);
    if (importStart === -1) return sourceFile.text; // nothing to do
    let importEnd = -1;
    for (let statement of sourceFile.statements) {
      if (statement.kind !== SyntaxKind.ImportDeclaration) break;
      importEnd = statement.end;
    }
    if (importEnd === -1) throw new Error("Couldn't find the end of imports");
    return sourceFile.text.slice(0, importStart) +
      this.stringifyImports(imports) +
      sourceFile.text.slice(importEnd)
  }

}
