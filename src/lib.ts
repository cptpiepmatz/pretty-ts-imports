/**
 * These are all the main components of primp.
 * If you wish to include anything in your own program, you can mostly do it
 * with these classes.
 *
 * You can easily import the {@link ImportSorter}, {@link ImportSeparator} and
 * {@link ImportIntegrator}, as well as the {@link FileManager} to load in your
 * typescript files and work with them in your code.
 * ```ts
 * // maybe something like this
 * import {
 *   FileManager,
 *   ImportSorter,
 *   ImportIntegrator
 * } from "pretty-ts-imports";
 *
 * let fileManager = new FileManager(yourTSConfigPath, someOfYourFiles);
 * let sorter = new ImportSorter(yourGeneratedRules, []);
 * let integrator = new ImportIntegrator({});
 * for (let imported of fileManager.imports.values()) {
 *   let integrated = integrator.integrate(imported.imports);
 *   // write your integrated content somewhere
 * }
 * ```
 *
 * If you create custom functions for your primp config, you may use the
 * function interfaces {@link ImportCompareFunction},
 * {@link ImportElementCompareFunction} and {@link SeparateByFunction}.
 * They help you make sure you are designing a correct comparator function.
 *
 * For examples check
 * [this](https://github.com/derPiepmatz/pretty-ts-imports/tree/main/examples).
 * Especially
 * [the example compare function](https://github.com/derPiepmatz/pretty-ts-imports/blob/main/examples/compare_functions/imports/dotJSFirst.ts).
 * @module
 */

// Exporting namespaces
export * as config from "./config";
export * as error from "./errors";
export * as builtin from "./sort_rules/builtin.index";

// Exporting the import management
export {default as FileManager} from "./FileManager";
export {default as FormattingOptions} from "./import_management/FormattingOptions";
export {default as Import} from "./import_management/Import";
export {default as ImportElement} from "./import_management/ImportElement";
export {default as ImportIntegrator} from "./import_management/ImportIntegrator";
export {default as ImportSorter} from "./import_management/ImportSorter";
export {default as ImportSeparator} from "./import_management/ImportSeparator";
export {default as ImportSource} from "./import_management/ImportSource";

// Exporting the sort rules
export {default as ImportCompareFunction} from "./sort_rules/ImportCompareFunction";
export {default as ImportElementCompareFunction} from "./sort_rules/ImportElementCompareFunction";
export {default as SeparateByFunction} from "./sort_rules/SeparateByFunction";
