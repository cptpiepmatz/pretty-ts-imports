import Import from "../import_management/Import";

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
