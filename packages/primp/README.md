<p align="center">
  <img width="250" alt="primp logo" src="https://raw.githubusercontent.com/cptpiepmatz/primp/a2a2b6051eb08e47b23f6ba32ebd01288a135394/icon/primp.svg">
</p>

<h1 align="center">@primp/primp</h1>
<p align="center">
  <b>✨ Pretty imports, your rules.</b>
</p>

<br>

<div align="center">

[![JSR](https://img.shields.io/badge/JSR-pending%20release-8683F2?style=for-the-badge)](https://jsr.io/@primp/primp)
[![Deno](https://img.shields.io/badge/Deno-2+-000000?style=for-the-badge&logo=deno)](https://deno.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22.18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/cptpiepmatz/primp?style=for-the-badge)](https://github.com/cptpiepmatz/primp/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/cptpiepmatz/primp/ci.yml?label=CI&style=for-the-badge)](https://github.com/cptpiepmatz/primp/blob/main/.github/workflows/ci.yml)

</div>

## About

**@primp/primp** is the core of [primp](../../README.md). It uses the TypeScript
parser to read the leading import block, applies configurable sorting and
grouping rules, and renders the result back into the file. The remaining source
text stays intact.

Use the CLI to format a project, or call `formatImports` from your own tools.

## Features

- **Composable rules:** Order declarations and named specifiers independently.
- **Custom grouping:** Insert blank lines using built-in or custom predicates.
- **Configurable rendering:** Control quotes, spacing, indentation, and
  wrapping.
- **Modern imports:** Preserve declaration-level and inline types, aliases, and
  `with` / `assert` attributes. Deferred imports are supported when the selected
  parser supports their syntax.
- **File workflows:** Recursive scans, multiple inputs, output directories,
  watching, and a CI-friendly check mode.
- **Extractors:** Built-in TypeScript and opt-in JavaScript support, with
  [Vue support](../vue/README.md) available separately.

## Installation

Requires **Deno 2+** or **Node.js 22.18+**. The package targets JSR; these
commands apply after its first release.

```sh
# Deno
deno add jsr:@primp/primp

# Node.js, through JSR's npm compatibility bridge
npx jsr add --npm @primp/primp
```

Examples below use JSR specifiers. In a Node project, replace `jsr:@primp/primp`
with `@primp/primp`, including in `/rules/*` imports.

The package depends on TypeScript 6.x as its parser. A project's own TypeScript
version can coexist with this dependency. TypeScript 7.x cannot replace it
because its root export no longer provides the parser APIs used here.

## Usage

### Command line

Install the global command with Deno:

```sh
deno install --global --allow-read --allow-write --allow-env --name primp jsr:@primp/primp/cli
```

Then pass one or more files or directories:

```sh
primp src -r
primp src tests index.ts -r
primp src -r --check
primp src -rw
primp src -r --output formatted
```

Alternatively, run the `/cli` entry point directly:

```sh
# Deno
deno run --allow-read --allow-write --allow-env jsr:@primp/primp/cli src -r

# Node.js, after the JSR npm-bridge installation
node node_modules/@primp/primp/cli.js src -r
```

The npm-compatible package has no `bin` metadata, so use the direct Node command
above rather than `npx @primp/primp`. The globally installed `primp` command
runs under Deno, including when used in Node projects.

| Flag                | Description                                                                             |
| ------------------- | --------------------------------------------------------------------------------------- |
| `-r, --recursive`   | Descend into subdirectories.                                                            |
| `-o, --output DIR`  | Write beneath another directory instead of updating in place.                           |
| `-c, --config FILE` | Load a specific config module.                                                          |
| `-w, --watch`       | Watch the selected files after the first formatting pass.                               |
| `--check`           | Print files needing formatting without writing them; exit 1 if any differ, otherwise 0. |
| `-h, --help`        | Show usage.                                                                             |
| `--version`         | Show the package version.                                                               |

`--check` cannot be combined with `--watch` or `--output`. Grouped short flags,
`--option=value`, and `--` for paths beginning with a dash are supported. Shell
globs can be used when your shell expands them into paths.

By default, scans include `.ts`, `.tsx`, `.mts`, and `.cts`, excluding
declaration files (`.d.ts`, `.d.mts`, `.d.cts`). Configured extractors determine
which other files are included. Explicit files without a matching extractor are
skipped. With multiple inputs, `--output` preserves their relative directory
structure.

Formatting prints only modified files. Check mode prints only files needing
formatting. Both print bare absolute paths, without status labels. Customize
this output with the callbacks below.

Each completed pass ends with `Checked N files`. When files differ, a second
line prints `Updated N files`, or `Needs formatting: N files` in check mode. The
second line is omitted when its count is zero; singular counts use `file`.

### Library

```ts
import { formatImports } from "jsr:@primp/primp";

const formatted = formatImports(
  'import { z, a } from "pkg";\n',
  { formatting: { quoteStyle: "single" } },
  "example.ts",
);
// import { a, z } from 'pkg';
```

`formatImports(source, config?, filename?)` returns a string synchronously. The
default filename is `input.ts`; provide a filename when using another extractor.
It uses the supplied config or defaults, without discovering a config file.

Only the leading import block is formatted. Header comments before the first
import are preserved; import blocks containing comments are left unchanged so
comments stay attached to their imports. Sorting side-effect imports changes
their execution order; a commented import block can preserve an order that
matters to your application.

## Configuration

Create a `primp.config.ts` with a default-exported object:

```ts
import { defineConfig, inverse } from "jsr:@primp/primp";
import { sourceName } from "jsr:@primp/primp/rules/imports";
import * as separators from "jsr:@primp/primp/rules/separators";

export default defineConfig({
  sortImports: [inverse(sourceName)],
  separateBy: [separators.packageSource],
  formatting: { quoteStyle: "single" },
});
```

`defineConfig` adds type checking and editor completion; a plain
default-exported object works too. The CLI searches from the **current working
directory** upward for `primp.config.ts`, `primp.config.mts`, `primp.config.js`,
or `primp.config.mjs`, in that order. One config applies to all inputs. Use
`--config` to select another.

Omitted fields use defaults. Arrays you provide replace their defaults; an empty
array disables that sorting or grouping stage. Formatting options merge with
their defaults. Import `defaultConfig` to extend an existing rule list.

### File reporting

Override `onFormat` and `onCheck` to customize CLI reporting:

```ts
import { defineConfig } from "jsr:@primp/primp";

export default defineConfig({
  onFormat({ path, changed }) {
    console.log(`${path}: ${changed ? "changed" : "unchanged"}`);
  },
  onCheck({ path, changed }) {
    if (changed) console.error(`${path}: incorrectly formatted`);
  },
  onSummary({ checked, updated, check }) {
    console.log(
      `${checked} checked, ${updated} ${check ? "need formatting" : "updated"}`,
    );
  },
});
```

Each synchronous per-file callback receives a `{ path, changed }` record with
the absolute source path and a boolean for whether formatted content differs
from the source, preserving its newline style. `onFormat` runs after a
successful write, including unchanged files, output-directory copies, and watch
passes. `onCheck` runs for every checked file, including correctly formatted
ones; it replaces the default output but does not affect the check exit code.
Use `onFormat() {}` or `onCheck() {}` to silence that mode. Library calls to
`formatImports` do not invoke these callbacks.

`onSummary({ checked, updated, check })` receives counts for unique supported
files, excluding unmatched inputs, and whether `--check` is active. In check
mode, `updated` counts files needing formatting; no files are written. Watch
mode reports the initial pass and then each single-file pass. Use
`onSummary() {}` to silence totals. A failed pass does not emit a summary.

### Default behavior

1. Side-effect imports come first.
2. Other imports are ordered by source: `node:` built-ins, packages, parent
   paths (`../`), then local paths (`./`).
3. Within source groups, value imports precede declaration-level `import type`.
4. Source paths and declaration text break ties.
5. Named specifiers sort by imported name, case-insensitively, then local name.

Blank lines separate side effects, built-ins, packages, relative imports, and
declaration-level types. Parent and local paths remain in the same relative-path
group. The default rule lists are:

```ts
import { defineConfig, inverse } from "jsr:@primp/primp";
import { elementName, specifierName } from "jsr:@primp/primp/rules/elements";
import {
  declarationText,
  nodePrefix,
  packageSource,
  parentPath,
  sideEffect,
  sourcePath,
  typeOnly,
} from "jsr:@primp/primp/rules/imports";
import * as separators from "jsr:@primp/primp/rules/separators";

export default defineConfig({
  sortImports: [
    sideEffect,
    nodePrefix,
    packageSource,
    parentPath,
    inverse(typeOnly),
    sourcePath,
    declarationText,
  ],
  sortImportElements: [specifierName, elementName],
  separateBy: [
    separators.sideEffect,
    separators.nodePrefix,
    separators.packageSource,
    separators.typeOnly,
  ],
});
```

### Built-in rules

Comparators run left to right until one returns a nonzero result. Use
`inverse(rule)` to reverse any declaration or named-element comparator.

| Entry point         | Rules                                                                                                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/rules/imports`    | `sideEffect`, `nodePrefix`, `packageSource`, `parentPath`, `typeOnly`, `deferred`, `importAttributes`, `defaultImport`, `uppercaseDefault`, `namespaceImport`, `sourceName`, `sourcePath`, `pathDepth`, `directoryName`, `declarationText` |
| `/rules/elements`   | `specifierName`, `elementName`, `lowercase`, `nameSuffix`, `aliased`, `inlineType`                                                                                                                                                         |
| `/rules/separators` | `sideEffect`, `nodePrefix`, `packageSource`, `parentPath`, `typeOnly`, `deferred`, `importAttributes`, `namespace`                                                                                                                         |

`separateBy` inserts a blank line when any listed predicate returns `true` for
adjacent imports. Combine predicates with `and(...rules)`, `or(...rules)`,
`xor(left, right)`, and `not(rule)` from the package root. `and()` always
matches; `or()` never matches.

### Custom rules

Write functions inline or import them relative to your config module:

```ts
import { defineConfig } from "jsr:@primp/primp";
import { sourcePath } from "jsr:@primp/primp/rules/imports";

import type { ImportCompareFunction } from "jsr:@primp/primp";

const aliasesFirst: ImportCompareFunction = (a, b) =>
  Number(b.source.name.startsWith("@/")) -
  Number(a.source.name.startsWith("@/"));

export default defineConfig({
  sortImports: [aliasesFirst, sourcePath],
});
```

Declaration and named-element comparators return a number, just like an array
sort comparator. Separator predicates return a boolean. The exported types
`ImportCompareFunction`, `ImportElementCompareFunction`, and
`SeparateByFunction` describe their arguments. See the
[custom-rule examples](../../examples/compare_functions/) for more.

### Formatting

| Option          | Default    | Controls                                               |
| --------------- | ---------- | ------------------------------------------------------ |
| `indent`        | `2`        | Indentation in multiline imports.                      |
| `bracketIndent` | `1`        | Spaces inside single-line named-import braces.         |
| `maxColumns`    | `80`       | Width used to wrap declarations.                       |
| `quoteStyle`    | `"double"` | Single or double quotes.                               |
| `trailingComma` | `true`     | Trailing comma in multiline named imports.             |
| `breakFrom`     | `false`    | Whether an overflowing `from` clause wraps separately. |

Defaults are compatible with `deno fmt`. Other settings can differ from its
formatting, so align both tools if you run them on the same files.

## JavaScript and other file formats

Register the JavaScript extractor alongside TypeScript to include both:

```ts
import { defineConfig, jsExtractor, tsExtractor } from "jsr:@primp/primp";

export default defineConfig({
  extractors: [tsExtractor, jsExtractor],
});
```

`jsExtractor` handles `.js`, `.jsx`, `.mjs`, and `.cjs`. For Vue, install
[@primp/vue](../vue/README.md) and add its `vueExtractor` to the list.

The first matching extractor handles a file. Providing `extractors` replaces the
default `[tsExtractor]`, so include it explicitly to retain TypeScript support.
Custom adapters implement `Extractor`: an `extensions` matcher (extension
string, filename regex, or predicate) and an `extract(source, filename)`
function returning `SourceSlice[]`. Each slice contains `start`, `end`, and
`content`. Primp formats those slices and preserves everything outside them;
invalid or overlapping offsets throw an error.

## Lower-level API

For more control, use the parsing, sorting, grouping, and rendering steps
directly:

```ts
import {
  ConfigHandler,
  ImportIntegrator,
  ImportSeparator,
  ImportSorter,
  parseImports,
} from "jsr:@primp/primp";

const config = new ConfigHandler();
const { sourceFile, imports } = parseImports(
  'import b from "b";\nimport a from "a";\n',
);
const sorted = new ImportSorter(config.sortImports, config.sortImportElements)
  .sort(imports);
const grouped = new ImportSeparator(config.separateBy).insertSeparator(sorted);
const formatted = new ImportIntegrator(config.formatting)
  .integrate(sourceFile, grouped);
```

The root also exports `Import`, `FileManager`, config types, and extractor
types. After publication, see the
[API documentation](https://jsr.io/@primp/primp/doc).

## License

**@primp/primp** is released under the [MIT License](../../LICENSE).
