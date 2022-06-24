import FullConfig from "./FullConfig";

import * as CompareImports from "../sort_rules/compare_imports";
import * as CompareImportElements from "../sort_rules/compare_import_elements";
import * as SeparateBy from "../sort_rules/separate_by";

/** Internal type used to securely type the default config. */
type DefaultConfig = FullConfig & {
  sortImports: (`${"!"|""}${keyof typeof CompareImports}`)[],
  sortImportElements: (`${"!"|""}${keyof typeof CompareImportElements}`)[],
  separateBy: (keyof typeof SeparateBy)[],
  require: {}
}

/** Default config. */
const defaultConfig: DefaultConfig = {

  sortImports: [
    "!sideEffect",
    "sourceType",
    "!namespacePresence",
    "pathName",
    "sourceName"
  ],

  sortImportElements: [
    "elementType",
    "basenameGroup",
    "elementName"
  ],

  separateBy: [
    "unequalSideEffectUse",
    "unequalPackageState",
    "unequalNamespaceUse"
  ],

  formatting: {
    bracketIndent: 0,
    indent: 2,
    maxColumns: 80,
    quoteStyle: "double"
  },

  require: {}
}

/** Default compare functions to sort elements. */
export const defaultSortImports = defaultConfig.sortImports;

/** Default compare functions to sort import elements. */
export const defaultSortImportElements = defaultConfig.sortImportElements;

/** Default compare functions to group imports. */
export const defaultSeparateBy = defaultConfig.separateBy;

/** Default formatting options. */
export const defaultFormatting = defaultConfig.formatting;

export default defaultConfig;
