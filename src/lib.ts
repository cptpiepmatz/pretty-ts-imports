// TODO: add module description everywhere

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
