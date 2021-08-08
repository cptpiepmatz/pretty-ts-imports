import Import from "../../../import_management/Import";
import {GroupedImports} from "../../GroupByFunction";

/**
 * Helper function to work on GroupByFunctions.
 * This allows to work on a simple function making an import array one level
 * deeper.
 * @param imports Nested import objects, may be as deep as wanted
 * @param worker Function to work on deepest level
 */
export default function workOnDeepest(
  imports: GroupedImports,
  worker: (workingImports: Import[]) => Import[][]
): GroupedImports[] {
  function digDeep(toDig: GroupedImports): void {
    for (let i = 0; i < toDig.length; i++) {
      if (!Array.isArray(toDig[i])) {
        const workedArray = worker(Array.from(toDig as Import[]));
        toDig.length = 0;
        // @ts-ignore I want to change the data type for this
        toDig.push(workedArray);
      }
      else {
        digDeep(toDig[i] as GroupedImports);
      }
    }
  }

  digDeep(imports);
  return imports as GroupedImports[];
}
