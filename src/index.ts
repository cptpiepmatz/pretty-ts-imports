import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";

const cliHandler = new CLIHandler();
const files = FileManager.getFiles(
  cliHandler.givenFileOrDirPath,
  cliHandler.shallRecursive
);
const tsConfigPath = cliHandler.tsConfigPath ?? process.cwd();
const fileManager = new FileManager(tsConfigPath, files);
const configPath = cliHandler.primpConfigPath ??
  ConfigHandler.findConfig(cliHandler.givenFileOrDirPath);
const configHandler = new ConfigHandler(configPath);
