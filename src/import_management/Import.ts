import {ImportDeclaration, SourceFile, SyntaxKind} from "typescript";

import ImportElement from "./ImportElement";
import ImportSource from "./ImportSource";
import FormattingOptions from "./FormattingOptions";

export default class Import {

  /** The source of the import, the right side. */
  readonly source: ImportSource;

  /** The imported elements, does not contain the default import. */
  readonly elements: ImportElement[];

  /** If {@link #isNamed} is true, this can hold an element. */
  readonly defaultElement?: ImportElement;

  /** If only types were imported. Uses the syntax: "import type". */
  readonly isTypeOnly: boolean;

  /** If the namespace import was used. i.e.: "import * as yourMom". */
  readonly isNamespace: boolean = false;

  /** If the named imports were used. i.e.: "import {a, b, c}". */
  readonly isNamed: boolean = false;

  /**
   * Constructor for the import.
   * Directly reads out the declaration to make it's uses easier.
   * @param importDeclaration declaration from the AST
   * @param sourceFile source file to get the texts from it
   */
  constructor(importDeclaration: ImportDeclaration, sourceFile: SourceFile) {
    // inspect the source
    let sourceText = importDeclaration.moduleSpecifier.getText(sourceFile);
    sourceText = sourceText.substring(1, sourceText.length - 1);
    let sourceIsRelative =
      (sourceText.startsWith("./") || sourceText.startsWith("../"));
    this.source = {
      name: sourceText,
      isRelative: sourceIsRelative,
      isPackage: !sourceIsRelative
    };

    // inspect the elements that get imported
    const importClause = importDeclaration.importClause;
    this.isTypeOnly = importClause?.isTypeOnly || false;
    this.elements = [];
    if (!importClause) return; // we are done here, no clauses

    if (importClause.name) {
      // if the clause has the name attribute, a default is imported
      const name = importClause.name.getText(sourceFile);
      this.defaultElement = {
        name: name,
        isDefault: true,
        isWildcard: false,
        isRenamed: false,
        isType: !!name.match(/^[A-Z]/),
        isFunctionOrObject: !name.match(/^[A-Z]/)
      };
    }

    if (importClause.namedBindings) {
      // if the clause has namedBindings, non-defaults get imported or the
      // wildcard was used
      const bindings = importClause.namedBindings;
      switch (bindings.kind) {
        case SyntaxKind.NamedImports:
          this.isNamed = true;
          // something like: "{a, b as c}"
          for (let element of bindings.elements) {
            const name = element.name.getText(sourceFile);
            let importElement: ImportElement = {
              name: name,
              isDefault: false,
              isWildcard: false,
              isRenamed: false,
              isType: !!name.match(/^[A-Z]/),
              isFunctionOrObject: !name.match(/^[A-Z]/),
            };
            if (element.propertyName) {
              // if the property name is set a rename was used
              const originalName = element.propertyName.getText(sourceFile);
              // destructuring for easy override
              importElement = {
                ...importElement,
                ...{
                  originalName: originalName,
                  isRenamed: true,
                  isType: !!originalName.match(/^[A-Z]/),
                  isFunctionOrObject: !originalName.match(/^[A-Z]/)
                }
              };
            }
            this.elements.push(importElement);
          }
          break;
        case SyntaxKind.NamespaceImport:
          this.isNamespace = true;
          // something like: "* as imported"
          const name = bindings.name.getText(sourceFile);
          this.elements.push({
            name: name,
            isDefault: false,
            isWildcard: true,
            isRenamed: true,
            originalName: "*",
            isType: !!name.match(/^[A-Z]/),
            isFunctionOrObject: !name.match(/^[A-Z]/)
          });
          break;
      }
    }
  }

  /**
   * Sorts the elements in-place.
   * @param comparator compare function to sort the import elements
   */
  sort(
    comparator: (
      firstImport: ImportElement,
      secondImport: ImportElement
    ) => number
  ): this {
    this.elements.sort(comparator);
    return this;
  }

  /**
   * The basic toString function to format this to a string.
   * If give some formatting options, it will format to the given options.
   * @param formattingOptions options to format the output
   */
  toString(formattingOptions: FormattingOptions = {
    indent: 2,
    bracketIndent: 0,
    quoteStyle: "double",
    maxColumns: 80
  }): string {
    // default values, just to make sure
    const indent = formattingOptions?.indent || 2;
    const bracketIndent = formattingOptions?.bracketIndent || 0;
    const quoteStyle = formattingOptions?.quoteStyle || "double";
    const maxColumns = formattingOptions?.maxColumns || 80;

    const indentString = " ".repeat(indent);
    const bracketIndentString = " ".repeat(bracketIndent);
    const quoteSymbol = quoteStyle === "double" ? '"' : "'";

    let output = "import ";

    if (this.isTypeOnly) output += "type ";

    let importElements: string[] = [];
    if (this.defaultElement) importElements.push(this.defaultElement.name);
    if (this.isNamed) {
      let namedElements: string[] = [];
      this.elements.forEach(element => {
        if (element.isRenamed) {
          namedElements.push(`${element.originalName} as ${element.name}`);
          return;
        }
        namedElements.push(element.name)
      });
      importElements.push("{" +
        bracketIndentString +
        namedElements.join(", ") +
        bracketIndentString +
        "}"
      );
    }
    if (this.isNamespace) {
      importElements.push(`* as ${this.elements[0].name}`);
    }
    output += importElements.join(", ");

    output += ` from ${quoteSymbol}${this.source.name}${quoteSymbol};`;

    return output;
  }

}

/**
 * Helper function to check if a columns exceeds the maximum column width.
 * @param toCheck the string to check
 * @param maxColumns the max width to check against
 */
function maxColumnsCheck(toCheck: string, maxColumns: number): boolean {
  return toCheck.split("\n").some(line => line.length > maxColumns);
}
