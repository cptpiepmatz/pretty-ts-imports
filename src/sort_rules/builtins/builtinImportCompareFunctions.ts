import ImportCompareFunction from "../ImportCompareFunction";
import comparePaths from "../compare_imports/comparePaths";
import compareSources from "../compare_imports/compareSources";
import deepPathsFirst from "../compare_imports/deepPathsFirst";
import defaultsTypesFirst from "../compare_imports/defaultsTypesFirst";
import flatPathsFirst from "../compare_imports/flatPathsFirst";
import namespaceBeforeNamed from "../compare_imports/namespaceBeforeNamed";
import packagesFirst from "../compare_imports/packagesFirst";
import relativesFirst from "../compare_imports/relativesFirst";

/** Mapping of all builtin compare functions. */
export const builtinImportCompareFunctions:
  Record<string, ImportCompareFunction>
= {
  "comparePaths": comparePaths,
  "compareSources": compareSources,
  "deepPathsFirst": deepPathsFirst,
  "defaultsTypesFirst": defaultsTypesFirst,
  "flatPathsFirst": flatPathsFirst,
  "namespaceBeforeNamed": namespaceBeforeNamed,
  "packagesFirst": packagesFirst,
  "relativesFirst": relativesFirst
}
