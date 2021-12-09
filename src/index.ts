import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import ImportSorter from "./import_management/ImportSorter";
import Separator from "./Separator";
import Integrator from "./Integrator";

const cliHandler = new CLIHandler();
const {givenFileOrDirPath, shallRecursive, primpConfigPath} = cliHandler;
const files = FileManager.getFiles(givenFileOrDirPath, shallRecursive);
const tsConfigPath = cliHandler.tsConfigPath ?? process.cwd();
const fileManager = new FileManager(tsConfigPath, files);
const configPath = primpConfigPath ?? ConfigHandler.findConfig(givenFileOrDirPath);
const configHandler = new ConfigHandler(configPath);
const {sortImports, sortImportElements} = configHandler;
const sortParams: any[] = [sortImports, sortImportElements];
if (configPath) sortParams.push(configPath, configHandler.require);
const sorter = configPath
  ? new ImportSorter(sortImports, sortImportElements, configPath!, configHandler.require)
  : new ImportSorter(sortImports, sortImportElements);
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
