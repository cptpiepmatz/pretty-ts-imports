import ImportElement from "../import_management/ImportElement";

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
  (
    importElementA: ImportElement,
    importElementB: ImportElement
  ): -1 | 0 | 1 | number;
}
