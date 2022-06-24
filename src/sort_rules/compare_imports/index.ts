/**
 * These are all the comparator functions for comparing two {@link Import}s
 * with each other.
 * They all implement {@link ImportCompareFunction}.
 *
 * You can read the filenames as
 * "sort imports (increasingly) by..."
 *
 * @module
 */

export {default as pathDepth} from "./pathDepth";
export {default as pathName} from "./pathName";
export {default as sourceName} from "./sourceName";
export {default as defaultPresence} from "./defaultPresence";
export {default as defaultType} from "./defaultType";
export {default as namespacePresence} from "./namespacePresence";
export {default as sourceType} from "./sourceType";
export {default as sideEffect} from "./sideEffect";
