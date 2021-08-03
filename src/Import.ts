import {ImportDeclaration, SyntaxKind} from "typescript";

import ImportElement from "./ImportElement";
import ImportSource from "./ImportSource";
import FormattingOptions from "./FormattingOptions";

export default class Import {

  readonly source: ImportSource;

  readonly elements: ImportElement[];

  /** If {@link #isNamed} is true, this can hold an element. */
  readonly defaultElement?: ImportElement;

  readonly isTypeOnly: boolean;

  readonly isNamespace: boolean = false;

  readonly isNamed: boolean = false;

  constructor(importDeclaration: ImportDeclaration) {
    // inspect the source
    let sourceText = importDeclaration.moduleSpecifier.getText();
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
      const name = importClause.name.getText();
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
            const name = element.name.getText();
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
              const originalName = element.propertyName.getText();
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
          const name = bindings.name.getText();
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
      this.elements.forEach(element => namedElements.push(element.name));
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

function maxColumnsCheck(toCheck: string, maxColumns: number): boolean {
  return toCheck.split("\n").some(line => line.length > maxColumns);
}
