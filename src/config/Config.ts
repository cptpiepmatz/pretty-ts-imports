import FormattingOptions from "../import_management/FormattingOptions";

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
