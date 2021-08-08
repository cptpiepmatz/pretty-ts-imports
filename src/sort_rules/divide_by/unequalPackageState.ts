import DivideByFunction from "../DivideByFunction";
import Import from "../../import_management/Import";

/**
 * Place a divider if only one of the imports is package.
 * @param leadingImport Leading import
 * @param followingImport Following import
 */
const unequalPackageState: DivideByFunction = function(
  leadingImport: Import,
  followingImport: Import
): boolean {
  const leadingIsPackage = leadingImport.source.isPackage;
  const followingIsPackage = followingImport.source.isPackage;
  return leadingIsPackage !== followingIsPackage;
}

export default unequalPackageState;
