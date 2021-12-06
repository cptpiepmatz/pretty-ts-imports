import FormattingOptions from "../import_management/FormattingOptions";
import {readdirSync, readFileSync, statSync} from "fs";
import {basename, dirname, extname} from "path";
import * as JSON5 from "json5";
import * as YAML from "yaml";
import Config from "./Config";
import {FullConfig} from "./FullConfig";
import {
  defaultGroupBy,
  defaultSortImportElements,
  defaultSortImports,
  defaultFormatting
} from "./defaultConfig";

/** Supported config file formats. */
export const supportedFormats = [
  ".json",
  ".json5",
  ".yaml"
];

/** Supported config file names. ("primp" is recommended.) */
export const supportedConfigNames = [
  "primp",
  "pretty-ts-imports",
  "prettyTsImports".toLowerCase()
];

/**
 * Class for handling the config files.
 * It parses the config and makes the options of them available.
 * If the parsed config misses some options the defaults will be used.
 */
export default class ConfigHandler implements FullConfig {

  // TODO: test me

  readonly formatting: Required<FormattingOptions>;
  readonly sortImports: string[];
  readonly sortImportElements: string[];
  readonly separateBy: string[];
  readonly require: Record<string, string>;

  /**
   * Constructor.
   * Reads and parses a config file and makes the options of it public.
   * @param configPath
   */
  constructor(configPath?: string) {
    let config: Config = {};
    if (configPath) {
      let configContent = readFileSync(configPath, "utf-8");
      switch (extname(configPath)) {
        case ".json":
          config = JSON.parse(configContent);
          break;
        case ".json5":
          config = JSON5.parse(configContent);
          break;
        case ".yml":
          config = YAML.parse(configContent);
          break;
        default:
          throw new Error("format not supported");
      }
    }

    this.sortImports = config.sortImports ?? defaultSortImports;
    this.sortImportElements = config.sortImportElements ?? defaultSortImportElements;
    this.separateBy = config.separateBy ?? defaultGroupBy;
    this.require = config.require ?? {};
    this.formatting = Object.assign({}, defaultFormatting, config.formatting);
  }

  /**
   * Checks if a config path points to a supported config file name.
   * @param configPath Path to check for
   */
  static isSupportedConfigFile(configPath: string): boolean {
    let ext = extname(configPath);
    if (supportedFormats.includes(ext)) {
      if (supportedConfigNames.includes(
        basename(configPath, ext).toLowerCase())
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Tries to find a config file from the give entry point.
   * @param entryPoint
   */
  static findConfig(entryPoint: string): string | undefined {
    let stat = statSync(entryPoint);

    if (stat.isFile()) {
      // maybe the file is config file
      if (ConfigHandler.isSupportedConfigFile(entryPoint)) {
        return entryPoint;
      }
    }

    if (stat.isDirectory()) {
      // check all files in the directory for a config
      let files = readdirSync(entryPoint);
      for (let file of files) {
        if (ConfigHandler.isSupportedConfigFile(file)) {
          return file;
        }
      }

      // if none is found, go up one directory
      let upper = dirname(entryPoint);
      if (upper === entryPoint) {
        // if there is no more to go up, there may be no config
        return undefined;
      }
      return ConfigHandler.findConfig(upper);
    }

    return undefined;
  }
}
