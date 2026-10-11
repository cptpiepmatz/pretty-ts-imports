import { statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { elementName, specifierName } from "../rules/elements.ts";
import {
  declarationText,
  nodePrefix,
  packageSource,
  parentPath,
  sideEffect,
  sourcePath,
  typeOnly,
} from "../rules/imports.ts";
import * as separators from "../rules/separators.ts";
import { defaultFormattingOptions } from "./core.ts";
import { tsExtractor } from "./extractors.ts";
import * as ops from "./rules.ts";

import type { FormattingOptions } from "./core.ts";
import type { Extractor } from "./extractors.ts";
import type {
  ImportCompareFunction,
  ImportElementCompareFunction,
  SeparateByFunction,
} from "./rules.ts";

/** The result of formatting or checking a source file in the CLI. */
export interface FileReport {
  /** Absolute source file path. */
  path: string;
  /** Whether formatting differs from the source content. */
  changed: boolean;
}

/** Totals for a completed CLI pass. */
export interface SummaryReport {
  /** Number of unique supported files processed. */
  checked: number;
  /** Number of files changed, or needing formatting in check mode. */
  updated: number;
  /** Whether this pass ran in check mode, without writing files. */
  check: boolean;
}

/** Options for formatting, sorting, and grouping imports. */
export interface Config {
  /** Import comparators in priority order; use `inverse(rule)` to reverse one. */
  sortImports?: ImportCompareFunction[];

  /** Comparators for elements within each import. */
  sortImportElements?: ImportElementCompareFunction[];

  /** Predicates that separate adjacent imports with a blank line. */
  separateBy?: SeparateByFunction[];

  /** Overrides for rendered import declarations. */
  formatting?: FormattingOptions;

  /** Ordered extractors; the first matching adapter handles a file. */
  extractors?: Extractor[];

  /**
   * Called by the CLI after each successful write (including unchanged files).
   * Receives a record with the absolute source path and changed status.
   * Defaults to printing only changed files' absolute paths, without status labels.
   */
  onFormat?: (report: FileReport) => void;

  /**
   * Called by the CLI for every checked file, without writing it.
   * Receives a record with the absolute source path and changed status.
   * Defaults to printing only absolute paths that need formatting.
   */
  onCheck?: (report: FileReport) => void;

  /**
   * Called after each CLI pass with a record containing checked and updated
   * file counts and the check flag.
   * Defaults to printing the checked total and, when nonzero, the updated total.
   * Watch events each form a single-file pass.
   */
  onSummary?: (report: SummaryReport) => void;
}

/** Provide type checking and editor completion for a config's default export. */
export function defineConfig(config: Config): Config {
  return config;
}

/** A config with every optional field filled in from the defaults. */
export type FullConfig = Required<Config> & {
  formatting: Required<FormattingOptions>;
};

/** Side effects, then built-ins, packages, parents, locals; values before types. */
export const defaultConfig: FullConfig = {
  onFormat: ({ path, changed }) => {
    if (!changed) return;
    console.log(path);
  },
  onCheck: ({ path, changed }) => {
    if (changed) console.log(path);
  },
  onSummary: ({ checked, updated, check }) => {
    console.log(`Checked ${checked} ${checked === 1 ? "file" : "files"}`);
    if (updated > 0) {
      console.log(
        `${check ? "Needs formatting:" : "Updated"} ${updated} ${
          updated === 1 ? "file" : "files"
        }`,
      );
    }
  },
  extractors: [tsExtractor],
  sortImports: [
    sideEffect,
    nodePrefix,
    packageSource,
    parentPath,
    ops.inverse(typeOnly),
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
  formatting: { ...defaultFormattingOptions },
};

/** Resolve defaults and discover TypeScript config files. */
export class ConfigHandler implements FullConfig {
  readonly extractors: Extractor[];
  readonly sortImports: ImportCompareFunction[];
  readonly sortImportElements: ImportElementCompareFunction[];
  readonly separateBy: SeparateByFunction[];
  readonly formatting: Required<FormattingOptions>;
  readonly onFormat: (report: FileReport) => void;
  readonly onCheck: (report: FileReport) => void;
  readonly onSummary: (report: SummaryReport) => void;

  /** Fill in omitted fields from the defaults. */
  constructor(config: Config = {}) {
    this.onFormat = config.onFormat ?? defaultConfig.onFormat;
    this.onCheck = config.onCheck ?? defaultConfig.onCheck;
    this.onSummary = config.onSummary ?? defaultConfig.onSummary;
    this.extractors = config.extractors ?? [...defaultConfig.extractors];
    this.sortImports = config.sortImports ?? [...defaultConfig.sortImports];
    this.sortImportElements = config.sortImportElements ??
      [...defaultConfig.sortImportElements];
    this.separateBy = config.separateBy ?? [...defaultConfig.separateBy];
    this.formatting = { ...defaultConfig.formatting, ...config.formatting };
  }

  /** Import a config module. The runtime must support TypeScript modules. */
  static async load(path?: string): Promise<ConfigHandler> {
    if (!path) return new ConfigHandler();
    const url = pathToFileURL(resolve(path)).href;
    const module: { default?: unknown } = await import(url);
    const value = module.default;
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(`Config must default-export an object: ${path}`);
    }
    return new ConfigHandler(value as Config);
  }

  /** Search from a file or directory upward for a config file. */
  static findConfig(entryPoint: string): string | undefined {
    const expectedFileNames = [
      "primp.config.ts",
      "primp.config.mts",
      "primp.config.js",
      "primp.config.mjs",
    ];

    let current = resolve(entryPoint);
    while (true) {
      for (const fileName of expectedFileNames) {
        const candidate = join(current, fileName);
        try {
          if (statSync(candidate).isFile()) return candidate;
        } catch { /* Ignore failed lookups. */ }
      }

      const parent = dirname(current);
      if (parent === current) return undefined;
      current = parent;
    }
  }
}
