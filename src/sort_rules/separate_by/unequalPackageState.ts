import SeparateByFunction from "../SeparateByFunction";

/**
 * Place a separator if only one of the imports is package.
 * @param leading Leading import
 * @param following Following import
 */
const unequalPackageState: SeparateByFunction = function(leading, following): boolean {
  const leadingIsPackage = leading.source.isPackage;
  const followingIsPackage = following.source.isPackage;
  return leadingIsPackage !== followingIsPackage;
};

export default unequalPackageState;
