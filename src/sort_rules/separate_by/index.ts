/**
 * These are all the comparator functions for separating two
 * {@link Import}s.
 * They all implement {@link SeparateByFunction}.
 *
 * You can read the filenames as
 * "separate imports by..."
 *
 * @module
 */

export {default as unequalPackageState} from "./unequalPackageState";
export {default as unequalNamespaceUse} from "./unequalNamespaceUse";
export {default as unequalSideEffectUse} from "./unequalSideEffectUse";
