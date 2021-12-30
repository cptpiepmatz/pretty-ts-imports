import {homedir} from "os";
import {dirname, join} from "path";

import {ConfigHandler} from "../../src/config";
import {
  defaultFormatting,
  defaultSeparateBy,
  defaultSortImportElements,
  defaultSortImports
} from "../../src/config/defaultConfig";

describe("ConfigHandler", function() {

  const jsonConfigPath = join(__dirname, "./config-files/primp.json");
  const json5ConfigPath = join(__dirname, "./config-files/primp.json5");
  const ymlConfigPath = join(__dirname, "./config-files/primp.yml");
  const yamlConfigPath = join(__dirname, "./config-files/primp.yaml");
  const txtConfigPath = join(__dirname, "./config-files/primp.txt");

  it("should construct correctly", function() {
    const jsonHandler = new ConfigHandler(jsonConfigPath);
    const json5Handler = new ConfigHandler(json5ConfigPath);
    const ymlHandler = new ConfigHandler(ymlConfigPath);
    const yamlHandler = new ConfigHandler(yamlConfigPath);
    const emptyHandler = new ConfigHandler();

    for (let handler of [jsonHandler, json5Handler, ymlHandler, yamlHandler]) {
      expect(handler.sortImports).toHaveSize(1);
      expect(handler.sortImports).toContain("compareSources");

      expect(handler.sortImportElements).toHaveSize(1);
      expect(handler.sortImportElements).toContain("groupBasenames");

      expect(handler.separateBy).toHaveSize(1);
      expect(handler.separateBy).toContain("unequalPackageState");

      expect(handler.require).toEqual({});

      expect(handler.formatting).toEqual({
        indent: 4,
        bracketIndent: 1,
        quoteStyle: "single",
        maxColumns: 120
      });
    }

    expect(emptyHandler.sortImports).toEqual(defaultSortImports);
    expect(emptyHandler.sortImportElements).toEqual(defaultSortImportElements);
    expect(emptyHandler.separateBy).toEqual(defaultSeparateBy);
    expect(emptyHandler.require).toEqual({});
    expect(emptyHandler.formatting).toEqual(defaultFormatting);

    expect(() => new ConfigHandler(txtConfigPath)).toThrowError();
  });

  it("should correctly detect supported config files", function() {
    expect(ConfigHandler.isSupportedConfigFile(jsonConfigPath)).toBeTrue();
    expect(ConfigHandler.isSupportedConfigFile(json5ConfigPath)).toBeTrue();
    expect(ConfigHandler.isSupportedConfigFile(ymlConfigPath)).toBeTrue();
    expect(ConfigHandler.isSupportedConfigFile(yamlConfigPath)).toBeTrue();

    expect(ConfigHandler.isSupportedConfigFile(txtConfigPath)).toBeFalse();
  });

  it("should find the config file", function() {
    // find files
    expect(ConfigHandler.findConfig(jsonConfigPath)).toEqual(jsonConfigPath);
    expect(ConfigHandler.findConfig(dirname(jsonConfigPath))).toBeDefined();

    // should not find the files
    expect(ConfigHandler.findConfig(txtConfigPath)).toBeUndefined();
    expect(ConfigHandler.findConfig(homedir())).toBeUndefined();
  });

});
