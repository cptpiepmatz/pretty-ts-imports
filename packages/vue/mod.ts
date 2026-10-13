/**
 * Extract script blocks from Vue single-file components.
 *
 * @module
 */

import { parse } from "@vue/compiler-sfc";

import type { Extractor, SourceSlice } from "@primp/primp";

/**
 * Extract `<script>` and `<script setup>` content for primp to format.
 * Supports only TypeScript (`lang="ts"`) and JavaScript (`lang="js"` or
 * no language). External scripts and unsupported languages produce no slices.
 * If the component cannot be parsed, return no slices so the file stays intact.
 *
 * @param source Complete Vue SFC source.
 * @param filename Filename used by the Vue parser for diagnostics.
 * @returns Script source and its location in the original component.
 */
export function extractVueScripts(
  source: string,
  filename = "component.vue",
): SourceSlice[] {
  return extractScripts(source, filename);
}

function extractScripts(
  source: string,
  filename: string,
  language?: "ts" | "js",
): SourceSlice[] {
  const { descriptor, errors } = parse(source, { filename });
  if (errors.length) return [];

  return [descriptor.script, descriptor.scriptSetup]
    .filter((script): script is NonNullable<typeof script> =>
      script !== null && !script.src &&
      ["js", "ts"].includes(script.lang || "js") &&
      (language === undefined || (script.lang || "js") === language)
    )
    .map((script) => ({
      start: script.loc.start.offset,
      end: script.loc.end.offset,
      content: script.content,
    }));
}

/** Vue SFC adapter supporting both TypeScript and JavaScript scripts. */
export const vueExtractor: Extractor = {
  extensions: ".vue",
  extract: extractVueScripts,
};

/** Vue SFC adapter supporting only `lang="ts"` scripts. */
export const tsVueExtractor: Extractor = {
  extensions: ".vue",
  extract: (source, filename) => extractScripts(source, filename, "ts"),
};

/** Vue SFC adapter supporting `lang="js"` scripts and scripts without a language. */
export const jsVueExtractor: Extractor = {
  extensions: ".vue",
  extract: (source, filename) => extractScripts(source, filename, "js"),
};
