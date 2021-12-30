declare module 'pretty-ts-imports/src/cli' {
  export {};

}
declare module 'pretty-ts-imports/src/CLIHandler' {
  /**
   * This class reads in the process arguments and makes them available with the
   * use of yargs.
   */
  export default class CLIHandler {
      /** Given file or dir path. */
      givenFileOrDirPath: string;
      /** If primp should run the dirs recursively. */
      shallRecursive: boolean;
      /** Output path, if it should differ. */
      outputPath?: string;
      /** Path for tsconfig.json file. */
      tsConfigPath?: string;
      /** Path for the primp config file. */
      primpConfigPath?: string;
      /** Whether primp should run in watch mode. */
      shallWatch: boolean;
      /**
       * Constructor.
       * Doesn't need any arguments since it uses the argv data from the global
       * {@link process}.
       */
      constructor();
  }

}
declare module 'pretty-ts-imports/src/config/Config' {
  import FormattingOptions from "pretty-ts-imports/src/import_management/FormattingOptions";
  /**
   * Interface describing how configs should look.
   *
   * Used by {@link ConfigHandler}.
   *
   * @see ../../examples/configs
   */
  export default interface Config {
      /**
       * Names of the compare functions in order of execution.
       * Primp will run through these to sort all imports.
       *
       * <b>Note: The names need to be exact with function names.</b>
       */
      sortImports?: string[];
      /**
       * Names of the compare functions in every import in order of execution.
       * Primp will run through these to sort all import elements.
       *
       * <b>Note: the names need to be exact with the function names.</b>
       */
      sortImportElements?: string[];
      /**
       * Names of group by functions to determine where to put a separator line.
       * Only one line around every group is possible, therefore the order is not
       * important.
       *
       * <b>Note: the names need to be exact with the function names.</b>
       */
      separateBy?: string[];
      /**
       * Formatting options.
       * @see FormattingOptions
       */
      formatting?: FormattingOptions;
      /**
       * An object containing custom compare functions.
       * Use the key for the function name and the value for the path of compare
       * function relative to the config file.
       *
       * To make sure the functions do work correctly, they should implement either
       * {@link ImportCompareFunction}, {@link ImportElementCompareFunction} or
       * {@link SeparateByFunction} and export their function as default.
       *
       * @see ../../examples/compare_functions/imports/dotJSFirst.ts
       */
      require?: Record<string, string>;
  }

}
declare module 'pretty-ts-imports/src/config/ConfigHandler' {
  import FullConfig from "pretty-ts-imports/src/config/FullConfig";
  import FormattingOptions from "pretty-ts-imports/src/import_management/FormattingOptions";
  /** Expected config file names. ("primp" is recommended.) */
  export const expectedConfigNames: string[];
  /**
   * Class for handling the config files.
   * It parses the config and makes the options of them available.
   * If the parsed config misses some options the defaults will be used.
   */
  export default class ConfigHandler implements FullConfig {
      /** The formatting the config handler found. */
      readonly formatting: Required<FormattingOptions>;
      /** The import compare function names. */
      readonly sortImports: string[];
      /** The import element compare function names. */
      readonly sortImportElements: string[];
      /** The separate by function names. */
      readonly separateBy: string[];
      /** A record of the require function names and their paths. */
      readonly require: Record<string, string>;
      /**
       * Constructor.
       * Reads and parses a config file and makes the options of it public.
       * @param configPath
       */
      constructor(configPath?: string);
      /**
       * Checks if a config path points to a supported config file name.
       * @param configPath Path to check for
       */
      static isSupportedConfigFile(configPath: string): boolean;
      /**
       * Tries to find a config file from the give entry point.
       * @param entryPoint
       */
      static findConfig(entryPoint: string): string | undefined;
  }

}
declare module 'pretty-ts-imports/src/config/defaultConfig' {
  import FullConfig from "pretty-ts-imports/src/config/FullConfig";
  import * as CompareImports from "pretty-ts-imports/src/sort_rules/compare_imports/index";
  import * as CompareImportElements from "pretty-ts-imports/src/sort_rules/compare_import_elements/index";
  import * as SeparateBy from "pretty-ts-imports/src/sort_rules/separate_by/index";
  /** Internal type used to securely type the default config. */
  type DefaultConfig = FullConfig & {
      sortImports: (`${"!" | ""}${keyof typeof CompareImports}`)[];
      sortImportElements: (`${"!" | ""}${keyof typeof CompareImportElements}`)[];
      separateBy: (keyof typeof SeparateBy)[];
      require: {};
  };
  /** Default config. */
  const defaultConfig: DefaultConfig;
  /** Default compare functions to sort elements. */
  export const defaultSortImports: string[] & ("pathDepth" | "pathName" | "sourceName" | "defaultPresence" | "defaultType" | "namespacePresence" | "sourceType" | "!pathDepth" | "!pathName" | "!sourceName" | "!defaultPresence" | "!defaultType" | "!namespacePresence" | "!sourceType")[];
  /** Default compare functions to sort import elements. */
  export const defaultSortImportElements: string[] & ("basenameGroup" | "elementType" | "elementName" | "!basenameGroup" | "!elementType" | "!elementName")[];
  /** Default compare functions to group imports. */
  export const defaultSeparateBy: string[] & ("unequalPackageState" | "unequalNamespaceUse")[];
  /** Default formatting options. */
  export const defaultFormatting: Required<import("pretty-ts-imports/src/lib").FormattingOptions>;
  export default defaultConfig;

}
declare module 'pretty-ts-imports/src/config/FullConfig' {
  import Config from "pretty-ts-imports/src/config/Config";
  import FormattingOptions from "pretty-ts-imports/src/import_management/FormattingOptions";
  /** Interface describing a full-fledged config. */
  export default interface FullConfig extends Required<Config> {
      /** Formatting options will every option. */
      formatting: Required<FormattingOptions>;
  }

}
declare module 'pretty-ts-imports/src/config/index' {
  export { default as Config } from "pretty-ts-imports/src/config/Config";
  export { default as ConfigHandler, expectedConfigNames } from "pretty-ts-imports/src/config/ConfigHandler";
  export { default as defaultConfig } from "pretty-ts-imports/src/config/defaultConfig";
  export { default as FullConfig } from "pretty-ts-imports/src/config/FullConfig";
  export { default as OnDemandTranspiler, RequiredFunction } from "pretty-ts-imports/src/config/OnDemandTranspiler";
  export { default as SupportedConfigFormat } from "pretty-ts-imports/src/config/SupportedConfigFormat";

}
declare module 'pretty-ts-imports/src/config/OnDemandTranspiler' {
  import { CompilerOptions } from "typescript";
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  import ImportElementCompareFunction from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  import SeparateByFunction from "pretty-ts-imports/src/sort_rules/SeparateByFunction";
  /** Union type of all functions the transpiler may return. */
  export type RequiredFunction = ImportCompareFunction | ImportElementCompareFunction | SeparateByFunction;
  /**
   * Class for transpiling external injected functions.
   *
   * Functions injected are expected to be written in Typescript and therefore
   * need to be transpiled into Javascript to use them in the code.
   * This class does exactly this.
   */
  export default class OnDemandTranspiler {
      private readonly configPath?;
      /** The compiler options to transpile the files against. */
      private readonly compilerOptions;
      /**
       * Constructor
       * @param tsConfig Typescript config object
       * @param configPath Path of the primp config
       */
      constructor(tsConfig: {
          compilerOptions: CompilerOptions;
      }, configPath?: string | undefined);
      /**
       * Transpile a file given the source path.
       * @param sourcePath Path of the source
       * @returns A function used to work with other classes
       */
      transpile(sourcePath: string): RequiredFunction;
  }

}
declare module 'pretty-ts-imports/src/config/SupportedConfigFormat' {
  /** Supported config file formats. */
  enum SupportedConfigFormat {
      JSON = ".json",
      JSON5 = ".json5",
      YML = ".yml",
      YAML = ".yaml"
  }
  export default SupportedConfigFormat;

}
declare module 'pretty-ts-imports/src/errors/CLIOptionsError' {
  /** Error class for errors that are caused by bad cli options. */
  export default class CLIOptionsError extends Error {
      readonly cliOption: string;
      readonly cliValue?: string | undefined;
      /**
       * Constructor.
       * @param message Message for the error
       * @param cliOption The option that caused the error
       * @param cliValue The value passed to the option
       */
      constructor(message: string, cliOption: string, cliValue?: string | undefined);
  }

}
declare module 'pretty-ts-imports/src/errors/index' {
  export { default as CLIOptionsError } from "pretty-ts-imports/src/errors/CLIOptionsError";
  export { default as IntegrationError } from "pretty-ts-imports/src/errors/IntegrationError";
  export { default as InvalidConfigError } from "pretty-ts-imports/src/errors/InvalidConfigError";
  export { default as MissingFileError } from "pretty-ts-imports/src/errors/MissingFileError";
  export { default as OnDemandTranspileError } from "pretty-ts-imports/src/errors/OnDemandTranspileError";
  export { default as UnsupportedFileFormatError } from "pretty-ts-imports/src/errors/UnsupportedFileFormatError";

}
declare module 'pretty-ts-imports/src/errors/IntegrationError' {
  /** Error class if something in the integration failed. */
  export default class IntegrationError extends Error {
      readonly sourceText: string;
      /**
       * Constructor
       * @param message Message of the error
       * @param sourceText Source text that failed the integration
       */
      constructor(message: string, sourceText: string);
  }

}
declare module 'pretty-ts-imports/src/errors/InvalidConfigError' {
  /** Error class for invalid config files. */
  export default class InvalidConfigError extends Error {
      readonly configKey: string;
      readonly configValue: any;
      /**
       * Constructor.
       * @param message Message of the error
       * @param configKey The name of the key that is invalid
       * @param configValue The value in the config that is invalid
       */
      constructor(message: string, configKey: string, configValue: any);
  }

}
declare module 'pretty-ts-imports/src/errors/MissingFileError' {
  /** Error class if a file is missing. */
  export default class MissingFileError extends Error {
      readonly path?: string | undefined;
      /**
       * Constructor.
       * @param message Message
       * @param path Path of the file that was missing
       */
      constructor(message: string, path?: string | undefined);
  }

}
declare module 'pretty-ts-imports/src/errors/OnDemandTranspileError' {
  /** Error class for errors that happen while then on demand transpile. */
  export default class OnDemandTranspileError extends Error {
      readonly path?: string | undefined;
      /**
       * Constructor for on demand transpile errors.
       * @param message Message of the error
       * @param path Path of the issue
       */
      constructor(message: string, path?: string | undefined);
  }

}
declare module 'pretty-ts-imports/src/errors/UnsupportedFileFormatError' {
  /** Error class for unsupported files. */
  export default class UnsupportedFileFormatError extends Error {
      readonly path: string;
      /**
       * Constructor.
       * @param path Path of the unsupported file
       */
      constructor(path: string);
  }

}
declare module 'pretty-ts-imports/src/FileManager' {
  import { readConfigFile, SourceFile } from "typescript";
  import Import from "pretty-ts-imports/src/import_management/Import";
  /**
   * Class holding all the imports from the given paths.
   */
  export default class FileManager {
      /** The typescript config. */
      readonly tsConfig: ReturnType<typeof readConfigFile>["config"];
      /** The imported files in their read in form. */
      readonly imports: Map<string, {
          sourceFile: SourceFile;
          imports: Import[];
      }>;
      /**
       * Constructor.
       * This takes a ts config to search for it's target and some file paths to
       * read them in and construct {@link Import}s from.
       * @param tsconfigPath The path for the ts config
       * @param filePaths One or many file paths for the .ts files
       */
      constructor(tsconfigPath: string, filePaths: string | string[]);
      /**
       * Read the files from the disk.
       * Also used in the constructor.
       * @param path Path for the file to read in
       */
      reloadFromDisk(path: string): void;
      /**
       * Writes the new content into the path.
       * @param path Path of the file
       * @param newContent The new content
       * @param newPath If given, the new entry point path
       */
      write(path: string, newContent: string, newPath?: string): void;
      /**
       * Checks if the file exists. (Hopefully)
       * @param fileName The name of the file
       * @private
       */
      private static fileExists;
      /**
       * Reads the file from a given path.
       * @param path The path to read from.
       * @private
       */
      private static readFile;
      /**
       * Given a path to whether a file or a directory, this finds all the .ts
       * files. If the path is a directory, it will return all .ts files in that
       * directory. If recursive is true, it will search the directory recursively.
       * Accepts wildcards.
       * @param path Path to a file or directory.
       * @param recursive If this should work recursively.
       */
      static getFiles(path: string, recursive?: boolean): string | string[];
  }

}
declare module 'pretty-ts-imports/src/import_management/FormattingOptions' {
  /** Interface describing how the outputted imports should be formatted. */
  export default interface FormattingOptions {
      /** The indent if the import needs to use line break in order to fit. */
      indent?: number;
      /** The indent at the start and end of the named imports. */
      bracketIndent?: number;
      /** The quote style to use for the import source. */
      quoteStyle?: "double" | "single";
      /** The max columns the output should not overlap. */
      maxColumns?: number;
  }

}
declare module 'pretty-ts-imports/src/import_management/Import' {
  import { ImportDeclaration, SourceFile } from "typescript";
  import ImportElement from "pretty-ts-imports/src/import_management/ImportElement";
  import ImportSource from "pretty-ts-imports/src/import_management/ImportSource";
  import FormattingOptions from "pretty-ts-imports/src/import_management/FormattingOptions";
  /**
   * Class for easy representation of an import.
   *
   * This class maps the import declarations to simple attributes.
   * Used for comparing them against each other.
   */
  export default class Import {
      /** The source of the import, the right side. */
      readonly source: ImportSource;
      /** The imported elements, does not contain the default import. */
      readonly elements: ImportElement[];
      /** If {@link isNamed} is true, this can hold an element. */
      readonly defaultElement?: ImportElement;
      /** If only types were imported. Uses the syntax: "import type". */
      readonly isTypeOnly: boolean;
      /** If the namespace import was used. i.e.: "import * as yourMom". */
      readonly isNamespace: boolean;
      /** If the named imports were used. i.e.: "import {a, b, c}". */
      readonly isNamed: boolean;
      /**
       * Constructor for the import.
       * Directly reads out the declaration to make its uses easier.
       * @param importDeclaration declaration from the AST
       * @param sourceFile source file to get the texts from it
       */
      constructor(importDeclaration: ImportDeclaration, sourceFile: SourceFile);
      /**
       * Sorts the elements in-place.
       * @param comparator compare function to sort the import elements
       */
      sort(comparator: (firstImport: ImportElement, secondImport: ImportElement) => number): this;
      /**
       * The basic toString function to format this to a string.
       * If give some formatting options, it will format to the given options.
       * @param formattingOptions options to format the output
       */
      toString(formattingOptions?: FormattingOptions): string;
  }

}
declare module 'pretty-ts-imports/src/import_management/ImportElement' {
  /** The elements that are actually imported. The left side of the import. */
  export default interface ImportElement {
      /** The name of the imported element. */
      name: string;
      /** If the import used the default export. Either directly or by renaming. */
      isDefault: boolean;
      /** If the wildcard was used to import elements. */
      isWildcard: boolean;
      /** If the import used the "as" statement to rename the import. */
      isRenamed: boolean;
      /** If {@link isRenamed} is true, this will display the original name. */
      originalName?: string;
      /**
       * By inspecting the name, this tries to check if the import is a type.
       * So it can be a Type, Class, Enum or Interface.
       * They usually start with a uppercase letter.
       */
      isType: boolean;
      /**
       * By inspecting the name, this tries to check if the import is a function or
       * an object.
       * They usually start with a lowercase letter.
       */
      isFunctionOrObject: boolean;
  }

}
declare module 'pretty-ts-imports/src/import_management/ImportIntegrator' {
  import { SourceFile } from "typescript";
  import FormattingOptions from "pretty-ts-imports/src/import_management/FormattingOptions";
  import Import from "pretty-ts-imports/src/import_management/Import";
  /** Class for integrating imports back into their source file. */
  export default class ImportIntegrator {
      private readonly formatting;
      /**
       * Constructor
       * @param formatting Formatting for the imports
       */
      constructor(formatting: FormattingOptions);
      /**
       * Runs a toString on every import and concatenates them into one string.
       * @param imports Array of imports
       * @private
       */
      private stringifyImports;
      /**
       * Integrates the imports into the source file's text.
       *
       * <b>Note: Does not actually write the file into the filesystem.</b>
       * @param sourceFile
       * @param imports
       */
      integrate(sourceFile: SourceFile, imports: (Import | null)[]): string;
  }

}
declare module 'pretty-ts-imports/src/import_management/ImportSeparator' {
  import Import from "pretty-ts-imports/src/import_management/Import";
  import SeparateByFunction from "pretty-ts-imports/src/sort_rules/SeparateByFunction";
  /** Class to insert the separators into the imports. */
  export default class ImportSeparator {
      /**
       * Array of separate by rules.
       * Order is not relevant.
       */
      readonly separateByRules: SeparateByFunction[];
      /**
       * Constructor with only separate by rules.
       * @param separateByRules Array of separate by rules
       */
      constructor(separateByRules: string[]);
      /**
       * Constructor including external functions.
       * @param separateByRules Array of separate by rules
       * @param requireFunctions Record of external functions by their function name
       */
      constructor(separateByRules: string[], requireFunctions: Record<string, SeparateByFunction>);
      /**
       * Given two imports, this will decide if a separator should be placed in
       * between according to the separate by rules.
       *
       * If at least one of them is not an import no more separator are needed.
       * @param a Import A
       * @param b Import B
       * @private
       */
      private decideSeparator;
      /**
       * Inserts the null elements as separator in an array of imports.
       * @param imports Array of imports to insert the separator
       */
      insertSeparator(imports: Import[]): (Import | null)[];
  }

}
declare module 'pretty-ts-imports/src/import_management/ImportSorter' {
  import Import from "pretty-ts-imports/src/import_management/Import";
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  import ImportElementCompareFunction from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  import { RequiredFunction } from "pretty-ts-imports/src/config/index";
  /** Class for sorting imports and the import elements. */
  export default class ImportSorter {
      /**
       * Array of import compare functions.
       * The order of elements is important here.
       */
      readonly sortImportOrder: ImportCompareFunction[];
      /**
       * Array of import element compare functions.
       * The order of elements is important here.
       */
      readonly sortImportElementOrder: ImportElementCompareFunction[];
      /**
       * Constructor
       * @param sortImports Array of compare function names
       * @param sortImportElements Array of compare function names
       * @param requireFunctions Record of external functions mapped by their names
       */
      constructor(sortImports: string[], sortImportElements: string[], requireFunctions?: Record<string, RequiredFunction>);
      /**
       * Helper function to get the rule name and if it should get inverted.
       *
       * A "!" prepending the sort rule indicates inverting it.
       * @param rule The name of a sort rule given from the config
       * @private
       */
      private static shouldInverse;
      /**
       * Function to chain compare functions together.
       * @param sortRules An array of compare functions for the same type
       * @returns A new compare function running through every compare function
       * until it finds a non 0 value
       */
      static chainCompareFunctions<T>(sortRules: ((a: T, b: T) => number)[]): (a: T, b: T) => number;
      /**
       * Helper function to get the inverse of a comparator function.
       * Since comparator functions simply return numbers, this just returns the
       * negation of them.
       * @returns inverse of a comparator function
       * @param comparator comparator function
       */
      static inverseComparator<T>(comparator: ((a: T, b: T) => number)): (a: T, b: T) => number;
      /**
       * Sorts all imports according to the given sort rules.
       * @param imports Array of imports
       * @returns Array of sorted imports
       */
      sort(imports: Import[]): Import[];
  }

}
declare module 'pretty-ts-imports/src/import_management/ImportSource' {
  /**
   * The source of the imported element.
   * The right side of the import statement.
   */
  export default interface ImportSource {
      /** The name of the source, the literal string. */
      name: string;
      /**
       * By inspecting the name this tries to check if the source is a package.
       * A package has usually not path like structure.
       */
      isPackage: boolean;
      /**
       * By inspecting the name this tries to check if the source is a relative one.
       * Names starting with "./" or with "../" are considered relative.
       */
      isRelative: boolean;
  }

}
declare module 'pretty-ts-imports/src/lib' {
  export * as config from "pretty-ts-imports/src/config/index";
  export * as error from "pretty-ts-imports/src/errors/index";
  export * as builtin from "pretty-ts-imports/src/sort_rules/builtin.index";
  export { default as FileManager } from "pretty-ts-imports/src/FileManager";
  export { default as FormattingOptions } from "pretty-ts-imports/src/import_management/FormattingOptions";
  export { default as Import } from "pretty-ts-imports/src/import_management/Import";
  export { default as ImportElement } from "pretty-ts-imports/src/import_management/ImportElement";
  export { default as ImportIntegrator } from "pretty-ts-imports/src/import_management/ImportIntegrator";
  export { default as ImportSorter } from "pretty-ts-imports/src/import_management/ImportSorter";
  export { default as ImportSource } from "pretty-ts-imports/src/import_management/ImportSource";
  export { default as ImportCompareFunction } from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  export { default as ImportElementCompareFunction } from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  export { default as SeparateByFunction } from "pretty-ts-imports/src/sort_rules/SeparateByFunction";

}
declare module 'pretty-ts-imports/src/sort_rules/builtin.index' {
  export * as compareImports from "pretty-ts-imports/src/sort_rules/compare_imports/index";
  export * as compareImportElements from "pretty-ts-imports/src/sort_rules/compare_import_elements/index";
  export * as separateBy from "pretty-ts-imports/src/sort_rules/separate_by/index";

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/defaultPresence' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two imports by their presence of a default import.
   * An import with a default import is considered lesser (positioned higher).
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import {a, b, c} from "alpha";
   * import d, {e, f} from "beta";
   *
   * // sorted
   * import d, {e, f} from "beta";
   * import {a, b, c} from "alpha";
   * ```
   *
   * @see ImportElement#isDefault
   * @param a Import A
   * @param b Import B
   */
  const defaultPresence: ImportCompareFunction;
  export default defaultPresence;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/defaultType' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two default imports whether one of them is a type.
   * Element recognized as type imports are considered lesser (higher position).
   *
   * <i>This ignores imports without default imports.</i>
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import {gamma} from "Gamma";
   * import alpha from "Alpha";
   * import Beta from "Beta";
   *
   * // sorted
   * import {gamma} from "Gamma";
   * import Beta from "Beta";
   * import alpha from "Alpha";
   * ```
   *
   * @see ImportElement#isType
   * @param a Import A
   * @param b Import B
   */
  const defaultType: ImportCompareFunction;
  export default defaultType;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/index' {
  export { default as pathDepth } from "pretty-ts-imports/src/sort_rules/compare_imports/pathDepth";
  export { default as pathName } from "pretty-ts-imports/src/sort_rules/compare_imports/pathName";
  export { default as sourceName } from "pretty-ts-imports/src/sort_rules/compare_imports/sourceName";
  export { default as defaultPresence } from "pretty-ts-imports/src/sort_rules/compare_imports/defaultPresence";
  export { default as defaultType } from "pretty-ts-imports/src/sort_rules/compare_imports/defaultType";
  export { default as namespacePresence } from "pretty-ts-imports/src/sort_rules/compare_imports/namespacePresence";
  export { default as sourceType } from "pretty-ts-imports/src/sort_rules/compare_imports/sourceType";

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/namespacePresence' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compare two imports by their presence of a namespace import.
   * An import with a namespace import is considered lesser (positioned higher).
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import alpha from "Alpha";
   * import * as beta from "Beta";
   *
   * // sorted
   * import * as beta from "Beta";
   * import alpha from "Alpha";
   * ```
   *
   * @see Import#isNamespace
   * @param a Import A
   * @param b Import B
   */
  const namespacePresence: ImportCompareFunction;
  export default namespacePresence;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/pathDepth' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two path for their depth.
   * The deeper path is considered greater.
   *
   * <i>This ignores package names.</i>
   *
   * <b>Note: This does not take the path names into account.</b>
   *
   * <b>Example: </b>
   * ```ts
   * // unsorted
   * import a from "pretty-ts-imports/src/sort_rules/compare_imports/longer/path/index";
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/short-path/index";
   *
   * // sorted
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/short-path/index";
   * import a from "pretty-ts-imports/src/sort_rules/compare_imports/longer/path/index";
   * ```
   *
   * @param a Import A
   * @param b Import B
   */
  const pathDepth: ImportCompareFunction;
  export default pathDepth;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/pathName' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two source paths by their dir hierarchy from top to bottom.
   * Every element of the tree is compared against the other source and
   * alphabetically ordered.
   *
   * <i>This ignores package names.</i>
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import c from "pretty-ts-imports/src/sort_rules/compare_imports/alpha-beta/alpha/c/index";
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/alpha/gamma/b/index";
   * import a from "pretty-ts-imports/src/sort_rules/compare_imports/alpha/beta/a/index";
   *
   * // sorted
   * import a from "pretty-ts-imports/src/sort_rules/compare_imports/alpha/beta/a/index";
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/alpha/gamma/b/index";
   * import c from "pretty-ts-imports/src/sort_rules/compare_imports/alpha-beta/alpha/c/index";
   * ```
   *
   * @param a Import A
   * @param b Import B
   */
  const pathName: ImportCompareFunction;
  export default pathName;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/sourceName' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two imports based on their source name alphabetically.
   *
   * <i>This ignores relative sources. </i>
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import a from "beta";
   * import b from "alpha";
   *
   * // sorted
   * import b from "alpha";
   * import a from "beta";
   * ```
   *
   * @param a Import A
   * @param b Import B
   */
  const sourceName: ImportCompareFunction;
  export default sourceName;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_imports/sourceType' {
  import ImportCompareFunction from "pretty-ts-imports/src/sort_rules/ImportCompareFunction";
  /**
   * Compares two import sources whether they are relatives or packages.
   * A relative path is considered greater (positioned lower).
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/Beta/index";
   * import c from "Gamma";
   * import a from "Alpha";
   *
   *
   * // sorted
   * import c from "Gamma";
   * import a from "Alpha";
   * import b from "pretty-ts-imports/src/sort_rules/compare_imports/Beta/index";
   * ```
   *
   * @see ImportSource#isPackage
   * @see ImportSource#isRelative
   * @param a Import A
   * @param b Import B
   */
  const sourceType: ImportCompareFunction;
  export default sourceType;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_import_elements/basenameGroup' {
  import ImportElementCompareFunction from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  /**
   * Compares two import elements based on their names split apart on capital
   * letters.
   * Then this runs the sub words in reverse order to check for likeness.
   * If all sub words are the same but one is longer this will be recognized as
   * equal.
   *
   * <i>This ignores every element that is not a type.</i>
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import {StartBase, Stuff, OtherBase, PowStuff} from "stuff";
   *
   * // sorted
   * import {StartBase, OtherBase, Stuff, PowStuff} from "stuff";
   * ```
   *
   * @see ImportElement#isFunctionOrObject
   * @param a Import Element A
   * @param b Import Element B
   */
  const basenameGroup: ImportElementCompareFunction;
  export default basenameGroup;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_import_elements/elementName' {
  import ImportElementCompareFunction from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  /**
   * Compares two import element names by their name alphabetically.
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import {c, d, e, a} from "alphabet";
   *
   * // sorted
   * import {a, b, c, d} from "alphabet";
   * ```
   *
   * @param a Import Element A
   * @param b Import Element B
   */
  const elementName: ImportElementCompareFunction;
  export default elementName;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_import_elements/elementType' {
  import ImportElementCompareFunction from "pretty-ts-imports/src/sort_rules/ImportElementCompareFunction";
  /**
   * Compares two import elements whether they are a function, object or Type.
   * If both elements are the same the will recognized as equal.
   *
   * <b>Example:</b>
   * ```ts
   * // unsorted
   * import {a, B, C, d} from "alphabet";
   *
   * // sorted
   * import {a, d, B, C} from "alphabet";
   * ```
   *
   * @see ImportElement#isFunctionOrObject
   * @see ImportElement#isType
   * @param a Import Element A
   * @param b Import Element B
   */
  const elementType: ImportElementCompareFunction;
  export default elementType;

}
declare module 'pretty-ts-imports/src/sort_rules/compare_import_elements/index' {
  export { default as basenameGroup } from "pretty-ts-imports/src/sort_rules/compare_import_elements/basenameGroup";
  export { default as elementType } from "pretty-ts-imports/src/sort_rules/compare_import_elements/elementType";
  export { default as elementName } from "pretty-ts-imports/src/sort_rules/compare_import_elements/elementName";

}
declare module 'pretty-ts-imports/src/sort_rules/ImportCompareFunction' {
  import Import from "pretty-ts-imports/src/import_management/Import";
  /**
   * Interface to describe function to compare imports.
   * @see ImportElementCompareFunction
   */
  export default interface ImportCompareFunction {
      /**
       * Compare function.
       * Takes two Import objects and compares them.
       * The return value 0 may also be that the compare function can't decide.
       * @param importA Import A
       * @param importB Import B
       * @returns (<0) => A < B | (0) => A = B | (>0) => A > B
       */
      (importA: Import, importB: Import): -1 | 0 | 1 | number;
  }

}
declare module 'pretty-ts-imports/src/sort_rules/ImportElementCompareFunction' {
  import ImportElement from "pretty-ts-imports/src/import_management/ImportElement";
  /**
   * Interface to describe function to compare import elements.
   * @see ImportCompareFunction
   */
  export default interface ImportElementCompareFunction {
      /**
       * Compare function.
       * Takes two ImportElement objects and compares them.
       * This only sorts the elements inside one import statement.
       * The return value 0 may also be that the compare function can't decide.
       * @param importElementA Import element A
       * @param importElementB Import element B
       */
      (importElementA: ImportElement, importElementB: ImportElement): -1 | 0 | 1 | number;
  }

}
declare module 'pretty-ts-imports/src/sort_rules/SeparateByFunction' {
  import Import from "pretty-ts-imports/src/import_management/Import";
  /** Interface for functions deciding if separator should be set. */
  export default interface SeparateByFunction {
      /**
       * Decide if two imports should be separated or not.
       * If true, an empty line between them will be created.
       * @param leadingImport Leading import
       * @param followingImport Following import
       */
      (leadingImport: Import, followingImport: Import): boolean;
  }

}
declare module 'pretty-ts-imports/src/sort_rules/separate_by/index' {
  export { default as unequalPackageState } from "pretty-ts-imports/src/sort_rules/separate_by/unequalPackageState";
  export { default as unequalNamespaceUse } from "pretty-ts-imports/src/sort_rules/separate_by/unequalNamespaceUse";

}
declare module 'pretty-ts-imports/src/sort_rules/separate_by/unequalNamespaceUse' {
  import SeparateByFunction from "pretty-ts-imports/src/sort_rules/SeparateByFunction";
  /**
   * Place a separator between two imports if one of them is using a namespace
   * import and the other one is not.
   *
   * <b>Example:</b>
   * ```ts
   * // unseparated
   * import everything from "stuff";
   * import everyone from "people";
   * import * as everywhere from "places";
   * import * as everyway from "ways";
   * import everybody from "persons";
   *
   * // separated
   * import everything from "stuff";
   * import everyone from "people";
   *
   * import * as everywhere from "places";
   * import * as everyway from "ways";
   *
   * import everybody from "persons";
   * ```
   * @see Import#isNamespace
   * @param l Leading Import
   * @param f Following Import
   */
  const unequalNamespaceUse: SeparateByFunction;
  export default unequalNamespaceUse;

}
declare module 'pretty-ts-imports/src/sort_rules/separate_by/unequalPackageState' {
  import SeparateByFunction from "pretty-ts-imports/src/sort_rules/SeparateByFunction";
  /**
   * Place a separator between two imports if one of them is imported from a
   * package and the other one from a relative path.
   *
   * <b>Example:</b>
   * ```ts
   * // unseparated
   * import a from "alpha";
   * import b from "beta";
   * import c from "pretty-ts-imports/src/sort_rules/separate_by/gamma/index";
   * import d from "pretty-ts-imports/src/sort_rules/separate_by/delta/index";
   * import e from "epsilon";
   *
   * // separated
   * import a from "alpha";
   * import b from "beta";
   *
   * import c from "pretty-ts-imports/src/sort_rules/separate_by/gamma/index";
   * import d from "pretty-ts-imports/src/sort_rules/separate_by/delta/index";
   *
   * import e from "epsilon";
   * ```
   *
   * @see ImportElement#isPackage
   * @see ImportElement#isRelative
   * @param leading Leading Import
   * @param following Following Import
   */
  const unequalPackageState: SeparateByFunction;
  export default unequalPackageState;

}
declare module 'pretty-ts-imports' {
  import main = require('pretty-ts-imports/src/lib');
  export = main;
}