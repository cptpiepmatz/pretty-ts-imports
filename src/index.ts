import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import Sorter from "./Sorter";
import Separator from "./Separator";
import Integrator from "./Integrator";
import * as ts from "typescript";

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

const separator = new Separator(configHandler.separateBy);
const integrator = new Integrator(configHandler.formatting);
for (let imported of fileManager.imports) {
  sorter.sort(imported.imports);
  let integrated = integrator.integrate(
    imported.sourceFile,
    separator.insertSeparator(imported.imports)
  );
  fileManager.updateFile(imported.path, integrated);
}
