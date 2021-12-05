import DivideByFunction from "../DivideByFunction";
import unequalPackageState from "../divide_by/unequalPackageState";

/** Mapping of all the builtin divide by functions. */
export const builtinDivideByFunctions: Record<string, DivideByFunction> = {
  "unequalPackageState": unequalPackageState
}
