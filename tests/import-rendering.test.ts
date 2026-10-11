import { formatImports, ImportIntegrator, parseImports } from "@primp/primp";
import { expect } from "@std/expect";

import type { FormattingOptions } from "@primp/primp";

function render(input: string, options: FormattingOptions = {}): string {
  const imported = parseImports(input).imports[0];
  expect(imported).toBeDefined();
  const output = imported.toString(options);
  const reparsed = parseImports(output).imports;
  expect(reparsed).toHaveLength(1);
  expect(reparsed[0].source).toEqual(imported.source);
  expect(reparsed[0].elements).toEqual(imported.elements);
  expect(reparsed[0].defaultElement).toEqual(imported.defaultElement);
  expect(reparsed[0].phaseModifier).toBe(imported.phaseModifier);
  expect(reparsed[0].attributes).toEqual(imported.attributes);
  expect(reparsed[0].toString(options)).toBe(output);
  return output;
}

Deno.test("renderer composes each binding form and phase modifier", () => {
  for (
    const input of [
      'import "pkg";',
      'import defaultName from "pkg";',
      'import {} from "pkg";',
      'import { a, type B, c as local } from "pkg";',
      'import * as ns from "pkg";',
      'import defaultName, { a, b } from "pkg";',
      'import defaultName, * as ns from "pkg";',
      'import type defaultName from "pkg";',
      'import type { A, B } from "pkg";',
      'import defer * as ns from "pkg";',
      'import "pkg" with {};',
      'import value from "pkg" assert { type: "json" };',
    ]
  ) {
    expect(render(input)).toBe(input);
  }
});

Deno.test("renderer wraps named bindings structurally, including quoted braces", () => {
  for (const quoteStyle of ["double", "single"] as const) {
    const quote = quoteStyle === "double" ? '"' : "'";
    expect(
      render('import defaultName, { "}" as close, "{" as open } from "pkg";', {
        quoteStyle,
        maxColumns: 20,
        indent: 4,
        trailingComma: false,
      }),
    ).toBe(
      `import defaultName, {\n    ${quote}}${quote} as close,\n    ${quote}{${quote} as open\n} from ${quote}pkg${quote};`,
    );
  }
});

Deno.test("renderer breaks only the structural from clause", () => {
  expect(
    render('import { "a from b" as local, other } from "pkg from path";', {
      maxColumns: 20,
      breakFrom: true,
    }),
  ).toBe(
    'import {\n  "a from b" as local,\n  other,\n}\n  from "pkg from path";',
  );
  const sideEffect = 'import "a very long module from path";';
  expect(render(sideEffect, { maxColumns: 10, breakFrom: true })).toBe(
    sideEffect,
  );
});

Deno.test("renderer retains attributes when wrapping bindings and from clauses", () => {
  expect(
    render('import { a, b } from "pkg" with { "}": "{ from }" };', {
      maxColumns: 20,
      breakFrom: true,
    }),
  ).toBe('import {\n  a,\n  b,\n}\n  from "pkg" with { "}": "{ from }" };');
});

Deno.test("renderer wraps only beyond the width boundary", () => {
  const input = 'import { a, b } from "pkg";';
  expect(render(input, { maxColumns: input.length })).toBe(input);
  expect(render(input, { maxColumns: input.length - 1 }))
    .toBe('import {\n  a,\n  b,\n} from "pkg";');
  expect(render(input, { bracketIndent: 0 })).toBe('import {a, b} from "pkg";');
  expect(
    render('import { single } from "long-module-name";', { maxColumns: 10 }),
  )
    .toBe('import { single } from "long-module-name";');
});

Deno.test("renderer uses defaults for explicitly undefined options", () => {
  const input = 'import { a, b } from "pkg";';
  expect(render(input, { bracketIndent: undefined })).toBe(input);
  expect(render(input, { maxColumns: undefined })).toBe(render(input));
  expect(render(input, {
    indent: undefined,
    bracketIndent: undefined,
    quoteStyle: undefined,
    maxColumns: 20,
    trailingComma: undefined,
    breakFrom: undefined,
  })).toBe('import {\n  a,\n  b,\n} from "pkg";');
  const longInput = `import { a, b } from "${"x".repeat(80)}";`;
  expect(render(longInput, { maxColumns: undefined })).toBe(render(longInput));
});

Deno.test("renderer keeps a fitting from clause beside oversized specifiers", () => {
  expect(render(
    'import { extraordinarilyLongBindingName, b } from "p";',
    { maxColumns: 25, breakFrom: true },
  )).toBe('import {\n  extraordinarilyLongBindingName,\n  b,\n} from "p";');
});

Deno.test("renderer rejects invalid spacing options", () => {
  const imported = parseImports('import { a, b } from "pkg";').imports[0];
  for (const name of ["indent", "bracketIndent"] as const) {
    for (const value of [-1, 0.5, NaN, Infinity]) {
      expect(() => imported.toString({ [name]: value })).toThrow(RangeError);
      expect(() => imported.toString({ [name]: value })).toThrow(
        `${name} must be a non-negative integer`,
      );
    }
    expect(imported.toString({ [name]: 0 })).toBeDefined();
  }
});

Deno.test("printer escapes module and imported names for both quote styles", () => {
  const value =
    "quotes: '\" slash: \\ controls: \0\x01\t\n\r separators: \u2028\u2029";
  const literal = JSON.stringify(value);
  const input = `import { ${literal} as local } from ${literal};`;
  for (const quoteStyle of ["double", "single"] as const) {
    const output = render(input, { quoteStyle });
    const quote = quoteStyle === "single" ? "'" : '"';
    expect(output).toContain(`import { ${quote}`);
    expect(output).toContain(`from ${quote}`);
  }
});

Deno.test("printer preserves attribute value spelling while formatting keys", () => {
  const input =
    `import value from "pkg" with { "key": 'j\\u0073on', mode: "a\\nb" };`;
  expect(render(input, { quoteStyle: "single" })).toBe(
    `import value from 'pkg' with { 'key': 'j\\u0073on', mode: "a\\nb" };`,
  );
});

Deno.test("import integration detects newline style independently per file", () => {
  for (const newline of ["\r\n", "\n", "\r", "\r\n"]) {
    const input = [
      'import { b, a } from "pkg";',
      'import type { T } from "types";',
      "const untouched = 1;",
      "",
    ].join(newline);
    const expected = [
      "import {",
      "  a,",
      "  b,",
      '} from "pkg";',
      "",
      'import type { T } from "types";',
      "const untouched = 1;",
      "",
    ].join(newline);
    const config = { formatting: { maxColumns: 20 } };
    expect(formatImports(input, config)).toBe(expected);
    expect(formatImports(expected, config)).toBe(expected);

    const { sourceFile, imports } = parseImports(input);
    const integrated = new ImportIntegrator(config.formatting).integrate(
      sourceFile,
      imports,
    );
    expect(integrated.split(/\r\n|\n|\r/).join(newline)).toBe(integrated);
  }
});

Deno.test("new imports default to LF and preserve the untouched file's mixed endings", () => {
  const input = 'import { b, a } from "pkg";';
  const formatted = 'import {\n  a,\n  b,\n} from "pkg";';
  const config = { formatting: { maxColumns: 20 } };
  expect(formatImports(input, config)).toBe(formatted);
  const rest = "\r\nconst value = `line one\nline two`;\n";
  expect(formatImports(input + rest, config))
    .toBe(formatted.replaceAll("\n", "\r\n") + rest);
});
