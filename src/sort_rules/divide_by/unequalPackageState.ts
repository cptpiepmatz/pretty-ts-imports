import DivideByFunction from "../DivideByFunction";

/**
 * Place a divider if only one of the imports is package.
 * @param leading Leading import
 * @param following Following import
 */
const unequalPackageState: DivideByFunction = function(leading, following): boolean {
  const leadingIsPackage = leading.source.isPackage;
  const followingIsPackage = following.source.isPackage;
  return leadingIsPackage !== followingIsPackage;
};

export default unequalPackageState;
