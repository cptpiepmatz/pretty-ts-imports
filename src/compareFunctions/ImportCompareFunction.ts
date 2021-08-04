import Import from "../Import";

/** Interface to describe function to compare Imports. */
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
