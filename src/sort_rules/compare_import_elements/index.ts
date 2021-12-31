/**
 * These are all the comparator functions for comparing two
 * {@link ImportElement}s with each other.
 * They all implement {@link ImportElementCompareFunction}.
 *
 * You can read the filenames as
 * "sort import elements (increasingly) by..."
 *
 * @module
 */

export {default as basenameGroup} from "./basenameGroup";
export {default as elementType} from "./elementType";
export {default as elementName} from "./elementName";
