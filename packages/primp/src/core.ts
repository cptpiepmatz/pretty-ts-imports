import ts from "typescript";

import type { SourceFile } from "typescript";

import type { ImportElementCompareFunction } from "./rules.ts";

/** Options for formatting rendered import declarations. */
export interface FormattingOptions {
  /**
   * Number of spaces used to indent wrapped imports.
   *
   * Defaults to 2; also applies to an optionally wrapped `from` clause.
   */
  indent?: number;

  /**
   * Spaces inside single-line named-import braces.
   *
   * Defaults to 1.
   */
  bracketIndent?: number;

  /**
   * Quote style for module specifiers.
   *
   * Defaults to `"double"`.
   */
  quoteStyle?: "double" | "single";

  /**
   * Target line width before wrapping named specifiers.
   *
   * Defaults to 80.
   */
  maxColumns?: number;

  /**
   * Whether multiline named imports have a trailing comma.
   *
   * Defaults to true.
   */
  trailingComma?: boolean;

  /**
   * Whether to wrap an overflowing `from` clause.
   *
   * Defaults to false.
   */
  breakFrom?: boolean;
}

/** A binding on the left side of an import declaration. */
export interface ImportElement {
  /** Local binding, e.g. `local` in `import { remote as local }`. */
  name: string;

  /** Imported name before `as`, or `*` for a namespace import. */
  originalName?: string;

  /** Whether the imported name uses a string literal (e.g. `"foo-bar" as foo`). */
  originalNameIsStringLiteral?: boolean;

  /** Whether this is the default binding, held separately in {@link Import.defaultElement}. */
  isDefault: boolean;

  /** Whether this is a namespace (`* as name`) binding. */
  isWildcard: boolean;

  /** Whether an `as` binding was used (also true for namespace imports). */
  isRenamed: boolean;

  /** Whether this named specifier uses the inline `type` modifier. */
  isTypeOnly?: boolean;
}

/** The module specifier on the right side of an import declaration. */
export interface ImportSource {
  /** Unquoted module specifier, e.g. `./file.ts` or `package`. */
  name: string;

  /** Whether the specifier is not relative, including `node:` specifiers. */
  isPackage: boolean;

  /** Whether the specifier begins with `./` or `../`. */
  isRelative: boolean;
}

/** The key of an import attribute. */
export interface ImportAttributeKey {
  /** Unquoted key text. */
  name: string;

  /** Syntax used for the key. */
  type: "identifier" | "literal";
}

/** A key/value entry in an import attribute clause. */
export interface ImportAttribute {
  key: ImportAttributeKey;

  /** Original quoted value text. */
  value: string;
}

/** Import attribute entries, keyed by the clause keyword. */
export interface ImportAttributes {
  /** Entries in a `with` clause, if present. */
  with?: ImportAttribute[];

  /** Entries in an `assert` clause, if present. */
  assert?: ImportAttribute[];
}

export const defaultFormattingOptions: Required<FormattingOptions> = {
  indent: 2,
  bracketIndent: 1,
  quoteStyle: "double",
  maxColumns: 80,
  trailingComma: true,
  breakFrom: false,
};

// Fragments use LF internally; integration applies the destination file's style.
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const printerSourceFile = ts.createSourceFile(
  "input.ts",
  "",
  ts.ScriptTarget.Latest,
);

function printNode(node: ts.Node, sourceFile = printerSourceFile): string {
  return printer.printNode(ts.EmitHint.Unspecified, node, sourceFile);
}

function element(
  name: string,
  originalName?: string,
  isDefault = false,
  isTypeOnly = false,
  originalNameIsStringLiteral = false,
): ImportElement {
  return {
    name,
    originalName,
    originalNameIsStringLiteral,
    isDefault,
    isWildcard: originalName === "*",
    isRenamed: originalName !== undefined,
    isTypeOnly,
  };
}

function renderElement(imported: ImportElement, singleQuote: boolean): string {
  const originalName = imported.originalName === undefined
    ? undefined
    : imported.originalNameIsStringLiteral
    ? ts.factory.createStringLiteral(imported.originalName, singleQuote)
    : ts.factory.createIdentifier(imported.originalName);
  return printNode(ts.factory.createImportSpecifier(
    imported.isTypeOnly ?? false,
    originalName,
    ts.factory.createIdentifier(imported.name),
  ));
}

function renderAttributes(
  attributes: ImportAttributes,
  singleQuote: boolean,
): string {
  const keyword = attributes.with !== undefined
    ? "with"
    : attributes.assert !== undefined
    ? "assert"
    : undefined;
  if (!keyword) return "";
  const entries = (attributes[keyword] ?? []).map(({ key, value }) => {
    const name = key.type === "identifier"
      ? ts.factory.createIdentifier(key.name)
      : ts.factory.createStringLiteral(key.name, singleQuote);
    // Parsed values retain their original quotes and escapes when printed with
    // their source file, unlike synthesized string literals.
    const sourceFile = ts.createSourceFile(
      "attribute.ts",
      value,
      ts.ScriptTarget.Latest,
      true,
    );
    const statement = sourceFile.statements[0];
    if (!statement || !ts.isExpressionStatement(statement)) {
      throw new TypeError(`Invalid import attribute value: ${value}`);
    }
    return printNode(
      ts.factory.createImportAttribute(name, statement.expression),
      sourceFile,
    );
  });
  const content = entries.length ? ` ${entries.join(", ")} ` : "";
  return ` ${keyword} {${content}}`;
}

/** A sortable representation of a TypeScript import declaration. */
export class Import {
  /** Imported module and its package/relative classification. */
  readonly source: ImportSource;

  /** Named specifiers or a namespace binding, excluding the default binding. */
  readonly elements: ImportElement[] = [];

  /** Default binding, if present. */
  readonly defaultElement?: ImportElement;

  /** Phase modifier following `import`, if present. */
  readonly phaseModifier?: "type" | "defer";

  /** Whether the declaration uses `* as name`. */
  readonly isNamespace: boolean;

  /** Whether the declaration uses named braces (including empty braces). */
  readonly isNamed: boolean;

  /** Original `with` or `assert` import attributes, if present. */
  readonly attributes: ImportAttributes;

  /** Start offset of the import declaration in its source file. */
  readonly start: number;

  /** End offset of the import declaration in its source file. */
  readonly end: number;

  /**
   * Read an import declaration from the TypeScript syntax tree.
   *
   * Extract its source, bindings, import attributes, and source offsets.
   *
   * @param declaration Import declaration to model.
   * @param sourceFile Source file containing the declaration.
   */
  constructor(declaration: ts.ImportDeclaration, sourceFile: ts.SourceFile) {
    this.start = declaration.getStart(sourceFile);
    this.end = declaration.end;
    const name = (declaration.moduleSpecifier as ts.StringLiteral).text;
    const isRelative = name.startsWith("./") || name.startsWith("../");
    this.source = { name, isRelative, isPackage: !isRelative };
    const clause = declaration.importClause;
    const bindings = clause?.namedBindings;
    this.phaseModifier = clause?.phaseModifier === ts.SyntaxKind.TypeKeyword
      ? "type"
      : clause?.phaseModifier === ts.SyntaxKind.DeferKeyword
      ? "defer"
      : undefined;
    this.isNamed = bindings?.kind === ts.SyntaxKind.NamedImports;
    this.isNamespace = bindings?.kind === ts.SyntaxKind.NamespaceImport;
    this.attributes = {};
    if (declaration.attributes) {
      const keyword = declaration.attributes.token === ts.SyntaxKind.WithKeyword
        ? "with"
        : "assert";
      this.attributes[keyword] = declaration.attributes.elements.map((
        entry,
      ) => ({
        key: {
          name: entry.name.text,
          type: ts.isIdentifier(entry.name) ? "identifier" : "literal",
        },
        value: entry.value.getText(sourceFile),
      }));
    }
    if (clause?.name) {
      this.defaultElement = element(clause.name.text, undefined, true);
    }
    if (bindings && ts.isNamedImports(bindings)) {
      for (const specifier of bindings.elements) {
        this.elements.push(element(
          specifier.name.text,
          specifier.propertyName?.text,
          false,
          specifier.isTypeOnly,
          specifier.propertyName !== undefined &&
            ts.isStringLiteral(specifier.propertyName),
        ));
      }
    } else if (bindings && ts.isNamespaceImport(bindings)) {
      this.elements.push(element(bindings.name.text, "*"));
    }
  }

  /** Whether this is a side-effect-only import such as `import "module";`. */
  get isSideEffectOnly(): boolean {
    return !this.defaultElement && !this.isNamed && !this.isNamespace;
  }

  /**
   * Sort this import's elements in place.
   *
   * The default binding is held separately and is not sorted.
   *
   * @param comparator Function comparing two specifiers.
   * @returns This import for chaining.
   */
  sort(comparator: ImportElementCompareFunction): this {
    this.elements.sort(comparator);
    return this;
  }

  /**
   * Render this import declaration.
   *
   * The returned string does not include a final newline.
   *
   * @param options Formatting overrides; omitted settings use defaults.
   * @returns The formatted import declaration.
   */
  toString(options: FormattingOptions = {}): string {
    const {
      indent,
      bracketIndent,
      quoteStyle,
      maxColumns,
      trailingComma,
      breakFrom,
    } = {
      ...defaultFormattingOptions,
      ...options,
    };
    const singleQuote = quoteStyle === "single";
    const indentString = " ".repeat(indent);
    const bracketIndentString = " ".repeat(bracketIndent);
    const prefix = this.phaseModifier
      ? `import ${this.phaseModifier} `
      : "import ";
    const suffix =
      printNode(ts.factory.createStringLiteral(this.source.name, singleQuote)) +
      renderAttributes(this.attributes, singleQuote) + ";";
    if (this.isSideEffectOnly) return prefix + suffix;

    const specifiers = this.isNamed
      ? this.elements.map((imported) => renderElement(imported, singleQuote))
      : [];
    let namedBindings = specifiers.length
      ? `{${bracketIndentString}${specifiers.join(", ")}${bracketIndentString}}`
      : "{}";
    const bindings = (): string => {
      const parts: string[] = [];
      if (this.defaultElement) {
        parts.push(
          printNode(ts.factory.createIdentifier(this.defaultElement.name)),
        );
      }
      if (this.isNamed) parts.push(namedBindings);
      if (this.isNamespace) {
        parts.push(printNode(ts.factory.createNamespaceImport(
          ts.factory.createIdentifier(this.elements[0].name),
        )));
      }
      return parts.join(", ");
    };
    const render = (fromSeparator: string): string =>
      prefix + bindings() + fromSeparator + "from " + suffix;
    const overflows = (text: string): boolean =>
      text.split("\n").some((line) => line.length > maxColumns);

    let output = render(" ");
    if (overflows(output) && specifiers.length > 1) {
      namedBindings = "{\n" + indentString +
        specifiers.join(",\n" + indentString) +
        (trailingComma ? "," : "") + "\n}";
      output = render(" ");
    }
    return breakFrom && overflows(output)
      ? render(`\n${indentString}`)
      : output;
  }
}

/**
 * Parse the leading import block of a TypeScript source file.
 *
 * Imports after other statements are left alone. Shebangs and header comments
 * remain in the source file. Malformed files yield no sortable imports so that
 * a subsequent integration cannot silently rewrite invalid syntax.
 *
 * @param text Complete source text.
 * @param fileName Name for TypeScript's parser (defaults to `input.ts`).
 * @returns The source file and mutable import models in their original order.
 */
export function parseImports(text: string, fileName = "input.ts"): {
  sourceFile: SourceFile;
  imports: Import[];
} {
  const sourceFile = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
  );
  const imports: Import[] = [];
  if (hasParseErrors(sourceFile)) return { sourceFile, imports };
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) break;
    imports.push(new Import(statement, sourceFile));
  }
  return { sourceFile, imports };
}

function hasParseErrors(sourceFile: ts.SourceFile): boolean {
  return !!(sourceFile as ts.SourceFile & {
    parseDiagnostics?: readonly ts.Diagnostic[];
  })
    .parseDiagnostics?.length;
}

/** A formatter for reinserting imports into source text. */
export class ImportIntegrator {
  private readonly formatting: FormattingOptions;

  /**
   * Configure the formatting used for inserted imports.
   *
   * @param formatting Formatting overrides for inserted imports.
   */
  constructor(formatting: FormattingOptions = {}) {
    this.formatting = formatting;
  }

  /**
   * Integrate formatted imports into the source file's text.
   *
   * A `null` inserts one blank separator line. Blank lines within the original
   * import block are replaced according to the configured separator rules.
   * Files with syntax errors or comments within the import block are returned
   * unchanged rather than risking lost or detached comments. This does not
   * write to disk.
   *
   * @param sourceFile Source file whose leading imports will be replaced.
   * @param imports Sorted imports, with `null` marking blank lines.
   * @param newline Newline style of the enclosing file; defaults to the source's style.
   * @returns Source text with the formatted import block integrated.
   */
  integrate(
    sourceFile: SourceFile,
    imports: (Import | null)[],
    newline: string = sourceFile.text.match(/\r\n|\n|\r/)?.[0] ?? "\n",
  ): string {
    const first = sourceFile.statements[0];
    if (hasParseErrors(sourceFile)) return sourceFile.text;
    if (!first || !ts.isImportDeclaration(first)) return sourceFile.text;
    let last: ts.ImportDeclaration = first;
    for (const statement of sourceFile.statements.slice(1)) {
      if (!ts.isImportDeclaration(statement)) break;
      last = statement;
    }
    const start = first.getStart(sourceFile);
    // Never discard comments attached to a declaration or between declarations.
    const scanner = ts.createScanner(
      ts.ScriptTarget.Latest,
      false,
      ts.LanguageVariant.Standard,
      sourceFile.text.slice(start, last.end),
    );
    for (
      let kind = scanner.scan();
      kind !== ts.SyntaxKind.EndOfFileToken;
      kind = scanner.scan()
    ) {
      if (
        kind === ts.SyntaxKind.SingleLineCommentTrivia ||
        kind === ts.SyntaxKind.MultiLineCommentTrivia
      ) return sourceFile.text;
    }
    const lines: string[] = [];
    for (const imported of imports) {
      if (!imported) {
        lines.push("");
        continue;
      }
      lines.push(imported.toString(this.formatting));
    }
    const block = lines.join("\n").replace(/\r\n|\n|\r/g, newline);
    return sourceFile.text.slice(0, start) + block +
      sourceFile.text.slice(last.end);
  }
}
