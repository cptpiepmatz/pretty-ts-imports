/**
 * This namespace includes all the custom errors primp may throw at some point.
 * All error classes in here extend the regular
 * [Error class](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error).
 *
 * The errors are mostly thrown by these classes:
 * - {@link CLIOptionsError} by {@link FileManager}
 * - {@link IntegrationError} by {@link ImportIntegrator}
 * - {@link InvalidConfigError} by {@link ImportSeparator} and {@link ImportSorter}
 * - {@link MissingFileError} by {@link FileManager}
 * - {@link OnDemandTranspileError} by {@link OnDemandTranspiler}
 * - {@link UnsupportedFileFormatError} by {@link ConfigHandler}
 *
 * @module
 */

export {default as CLIOptionsError} from "./CLIOptionsError";
export {default as IntegrationError} from "./IntegrationError";
export {default as InvalidConfigError} from "./InvalidConfigError";
export {default as MissingFileError} from "./MissingFileError";
export {default as OnDemandTranspileError} from "./OnDemandTranspileError";
export {default as UnsupportedFileFormatError} from "./UnsupportedFileFormatError";
