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

  /** If {@link #isRenamed} is true, this will display the original name. */
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
