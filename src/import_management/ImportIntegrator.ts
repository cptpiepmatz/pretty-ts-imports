import {SourceFile, SyntaxKind} from "typescript";

import FormattingOptions from "./FormattingOptions";
import Import from "./Import";
import IntegrationError from "../errors/IntegrationError";

/** Class for integrating imports back into their source file. */
export default class ImportIntegrator {

  /**
   * Constructor
   * @param formatting Formatting for the imports
   */
  constructor(private readonly formatting: FormattingOptions) {}

  /**
   * Runs a toString on every import and concatenates them into one string.
   * @param imports Array of imports
   * @private
   */
  private stringifyImports(imports: (Import | null)[]) {
    let output = "";
    for (let imported of imports) {
      if (imported === null) output += "\n"; // line separator
      else output += imported.toString(this.formatting) + "\n";
    }
    return output.slice(0, -1);
  }

  /**
   * Integrates the imports into the source file's text.
   *
   * <b>Note: Does not actually write the file into the filesystem.</b>
   * @param sourceFile
   * @param imports
   */
  integrate(sourceFile: SourceFile, imports: (Import | null)[]): string {
    let importStart = sourceFile.text.search(/^import\s/gm);
    if (importStart === -1) return sourceFile.text; // nothing to do
    let importEnd = -1;
    for (let statement of sourceFile.statements) {
      // find the end of the import declarations
      if (statement.kind !== SyntaxKind.ImportDeclaration) break;
      importEnd = statement.end;
    }
    if (importEnd === -1) {
      throw new IntegrationError(
        "Couldn't find the end of imports",
        sourceFile.text
      );
    }
    return sourceFile.text.slice(0, importStart) +
      this.stringifyImports(imports) +
      sourceFile.text.slice(importEnd)
  }

}
