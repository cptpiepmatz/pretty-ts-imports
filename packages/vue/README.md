<p align="center">
  <img width="250" alt="primp logo" src="https://raw.githubusercontent.com/cptpiepmatz/primp/a2a2b6051eb08e47b23f6ba32ebd01288a135394/icon/primp.svg">
</p>

<h1 align="center">@primp/vue</h1>
<p align="center">
  <b>✨ Pretty imports in Vue components.</b>
</p>

<br>

<div align="center">

[![JSR](https://img.shields.io/badge/JSR-pending%20release-8683F2?style=for-the-badge)](https://jsr.io/@primp/vue)
[![Vue](https://img.shields.io/badge/Vue-3.5+-4FC08D?style=for-the-badge&logo=vue.js)](https://vuejs.org/)
[![License](https://img.shields.io/github/license/cptpiepmatz/primp?style=for-the-badge)](https://github.com/cptpiepmatz/primp/blob/main/LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/cptpiepmatz/primp/ci.yml?label=CI&style=for-the-badge)](https://github.com/cptpiepmatz/primp/blob/main/.github/workflows/ci.yml)

</div>

## About

**@primp/vue** adds Vue single-file component support to
[@primp/primp](../primp/README.md). It uses Vue's `@vue/compiler-sfc` parser to
extract script blocks, then lets primp sort and format their imports using the
same rules as ordinary TypeScript files.

For general installation, CLI usage, and configuration, see the
[primp guide](../primp/README.md).

## Features

- **Both script blocks:** Handle `<script>` and `<script setup>` independently.
- **JavaScript and TypeScript:** Support scripts without a `lang` attribute and
  scripts with `lang="js"` or `"ts"`. JSX and TSX scripts are not supported.
- **Preserve the component:** Templates, styles, custom blocks, and code outside
  the leading imports remain intact.
- **Shared configuration:** Use the same sorting, grouping, and formatting rules
  as the core package, from the CLI or a library call.

## Installation

Add the adapter to a project using [@primp/primp](../primp/README.md). The
package targets JSR; these commands apply after the first release.

```sh
# Deno
deno add jsr:@primp/vue

# Node.js, through JSR's npm compatibility bridge
npx jsr add --npm @primp/vue
```

In Node projects, use `@primp/primp` and `@primp/vue` in imports instead of the
`jsr:` specifiers below.

## Usage

### Configuration

Register the adapter in your project's `primp.config.ts`:

```ts
import { defineConfig, tsExtractor } from "jsr:@primp/primp";
import { vueExtractor } from "jsr:@primp/vue";

export default defineConfig({
  extractors: [tsExtractor, vueExtractor],
});
```

Providing an extractor list replaces the core default. Keep `tsExtractor` to
include ordinary TypeScript files, add `jsExtractor` for standalone JavaScript,
or use only `[vueExtractor]` to process Vue components. Scripts inside Vue
components do not require `jsExtractor`.

Use `tsVueExtractor` instead of `vueExtractor` to format only `lang="ts"`
scripts, or `jsVueExtractor` to format only `lang="js"` scripts and scripts
without a language. All three match `.vue` files, and the core uses only the
first matching extractor. To format both languages, use `vueExtractor` rather
than listing both language-specific extractors.

The [core CLI](../primp/README.md#command-line) will then include `.vue` files.
See also the [Vue config example](../../examples/vue/primp.config.ts).

### Library

Pass the adapter and a `.vue` filename to `formatImports`:

```ts
import { formatImports } from "jsr:@primp/primp";
import { vueExtractor } from "jsr:@primp/vue";

const source = `<script setup lang="ts">
import { ref, computed } from "vue";

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<template>
  <p>{{ doubled }}</p>
</template>
`;

const formatted = formatImports(
  source,
  { extractors: [vueExtractor] },
  "Counter.vue",
);
// The import becomes: import { computed, ref } from "vue";
```

The filename selects the extractor; without it, `formatImports` defaults to a
TypeScript filename. Add any core config options alongside `extractors` to
customize the output.

## API

The package exports these building blocks:

| Export                                 | Purpose                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `vueExtractor`                         | An `Extractor` matching `.vue` files, ready for `Config.extractors`.                              |
| `tsVueExtractor`                       | A `.vue` extractor that handles only `lang="ts"` scripts.                                         |
| `jsVueExtractor`                       | A `.vue` extractor that handles `lang="js"` scripts and scripts without a language.               |
| `extractVueScripts(source, filename?)` | Return script slices with `start`, `end`, and `content`; the default filename is `component.vue`. |

`extractVueScripts` only extracts source; it does not sort or format imports.
For example, use it to inspect the script sections yourself:

```ts
import { extractVueScripts } from "jsr:@primp/vue";

const scripts = extractVueScripts(
  '<script setup lang="ts">import a from "a";</script>',
  "Example.vue",
);
```

External `<script src="...">` blocks and unsupported script languages (including
`jsx` and `tsx`) are skipped. If Vue's parser reports errors, the extractor
returns no slices and primp leaves the component unchanged. Inside each
supported script, the core formatter's leading-import and comment-preservation
behavior applies.

After publication, see the [API documentation](https://jsr.io/@primp/vue/doc).

## License

**@primp/vue** is released under the [MIT License](../../LICENSE).
