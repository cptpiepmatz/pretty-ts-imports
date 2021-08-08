import Import from "../import_management/Import";

export type GroupedImports = Import[] | GroupedImports[];

/**
 * Interface describing how functions should look like if you want to group your
 * imports.
 * Stay true to the given groups and only split the deepest level.
 * @example
 * [[A,B],[C,D,E]] => [[[A,B]], [[C], [D, E]]]
 */
export default interface GroupByFunction {
  (imports: GroupedImports): GroupedImports;
}
