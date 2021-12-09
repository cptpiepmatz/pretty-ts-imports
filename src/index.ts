import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import ImportSorter from "./import_management/ImportSorter";
import ImportSeparator from "./import_management/ImportSeparator";
import ImportIntegrator from "./import_management/ImportIntegrator";

const cliHandler = new CLIHandler();
const {givenFileOrDirPath, shallRecursive, primpConfigPath} = cliHandler;
const files = FileManager.getFiles(givenFileOrDirPath, shallRecursive);
const tsConfigPath = cliHandler.tsConfigPath ?? process.cwd();
const fileManager = new FileManager(tsConfigPath, files);
const configPath = primpConfigPath ?? ConfigHandler.findConfig(givenFileOrDirPath);
const configHandler = new ConfigHandler(configPath);
const {sortImports, sortImportElements} = configHandler;
const sorter = new ImportSorter(sortImports, sortImportElements);
const separator = new ImportSeparator(configHandler.separateBy);
const integrator = new ImportIntegrator(configHandler.formatting);
for (let imported of fileManager.imports) {
  sorter.sort(imported.imports);
  let integrated = integrator.integrate(
    imported.sourceFile,
    separator.insertSeparator(imported.imports)
  );
  fileManager.updateFile(imported.path, integrated);
}
