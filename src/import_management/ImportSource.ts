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
