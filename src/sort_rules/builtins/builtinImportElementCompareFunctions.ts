import ImportElementCompareFunction from "../ImportElementCompareFunction";
import groupBasenames from "../compare_import_elements/groupBasenames";
import typesFirst from "../compare_import_elements/typesFirst";

/** Mapping of all builtin import element compare functions. */
export const builtinImportElementCompareFunctions
= {
  "groupBasenames": groupBasenames,
  "typesFirst": typesFirst
};
