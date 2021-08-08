import Import from "../import_management/Import";

/** Interface for functions deciding if divider should be set. */
export default interface DivideByFunction {
  /**
   * Decide if two imports should be divided or not.
   * If true, an empty line between them will be created.
   * @param leadingImport Leading import
   * @param followingImport Following import
   */
  (leadingImport: Import, followingImport: Import): boolean;
}
