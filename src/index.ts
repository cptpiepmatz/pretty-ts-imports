import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import Sorter from "./Sorter";
import Separator from "./Separator";

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
const sortParams: any[] = [configHandler.sortImports, configHandler.sortImportElements];
if (configPath) sortParams.push(configPath, configHandler.require);
const sorter: Sorter = configPath ?
  new Sorter(
    configHandler.sortImports,
    configHandler.sortImportElements,
    configPath!,
    configHandler.require
  ) :
  new Sorter(
    configHandler.sortImports,
    configHandler.sortImportElements
  );

let imports = sorter.sort(fileManager.imports[0].imports);
const separator = new Separator(configHandler.separateBy);
