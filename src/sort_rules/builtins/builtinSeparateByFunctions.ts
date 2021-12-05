import SeparateByFunction from "../SeparateByFunction";
import unequalPackageState from "../separate_by/unequalPackageState";

/** Mapping of all the builtin separate by functions. */
export const builtinSeparateByFunctions: Record<string, SeparateByFunction> = {
  "unequalPackageState": unequalPackageState
}
