import FullConfig from "./FullConfig";

/** Default config. */
const defaultConfig: FullConfig = {

  sortImports: [
    "packagesFirst",
    "comparePaths",
    "flatPathsFirst",
    "namespaceBeforeNamed",
    "defaultsTypesFirst",
    "compareSources"
  ],

  sortImportElements: [
    "typesFirst",
    "groupBasenames"
  ],

  separateBy: [
    "unequalPackageState"
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
