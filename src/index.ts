import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import ImportSorter from "./import_management/ImportSorter";
import ImportSeparator from "./import_management/ImportSeparator";
import ImportIntegrator from "./import_management/ImportIntegrator";
import OnDemandTranspiler, {RequiredFunction} from "./config/OnDemandTranspiler";

const cliHandler = new CLIHandler();
const {givenFileOrDirPath, shallRecursive, primpConfigPath} = cliHandler;
const files = FileManager.getFiles(givenFileOrDirPath, shallRecursive);
const tsConfigPath = cliHandler.tsConfigPath ?? process.cwd();
const fileManager = new FileManager(tsConfigPath, files);
const configPath = primpConfigPath ?? ConfigHandler.findConfig(givenFileOrDirPath);
const configHandler = new ConfigHandler(configPath);
const requiredRecord: Record<string, RequiredFunction> = {};
if (configPath) {
  const onDemandTranspiler = new OnDemandTranspiler(tsConfigPath, configPath);
  for (const [name, path] of Object.entries(configHandler.require)) {
    requiredRecord[name] = onDemandTranspiler.transpile(path);
  }
}
const {sortImports, sortImportElements} = configHandler;
const sorter = new ImportSorter(sortImports, sortImportElements, requiredRecord);
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
