/* istanbul ignore file - for some reason it finds missing functions */

/**
 * This namespace resolves around handling the config files.
 * It includes the classes and interfaces for the config.
 *
 * Also the {@link OnDemandTranspiler} and the {@link defaultConfig} are
 * available here.
 * @module
 */

export {default as Config} from "./Config";
export {default as ConfigHandler, expectedConfigNames} from "./ConfigHandler";
export {default as defaultConfig} from "./defaultConfig";
export {default as FullConfig} from "./FullConfig";
export {default as OnDemandTranspiler, RequiredFunction} from "./OnDemandTranspiler";
export {default as SupportedConfigFormat} from "./SupportedConfigFormat";
