import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";
import ConfigHandler from "./config/ConfigHandler";
import ImportSorter from "./import_management/ImportSorter";
import ImportSeparator from "./import_management/ImportSeparator";
import ImportIntegrator from "./import_management/ImportIntegrator";
import OnDemandTranspiler, {
  RequiredFunction
} from "./config/OnDemandTranspiler";
import watch from "node-watch";
import {join, relative, resolve} from "path";
import {SourceFile} from "typescript";
import Import from "./import_management/Import";

// TODO: get some fancy logging

const cliHandler = new CLIHandler();
const {
  givenFileOrDirPath,
  shallRecursive,
  primpConfigPath,
  outputPath
} = cliHandler;
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
for (let [path, {sourceFile, imports}] of fileManager.imports.entries()) {
  writeSorted(path, sourceFile, imports);
}

function writeSorted(path: string, sourceFile: SourceFile, imports: Import[]) {
  sorter.sort(imports);
  let integrated = integrator.integrate(
    sourceFile,
    separator.insertSeparator(imports)
  );
  if (outputPath) {
    let newPath = join(outputPath, relative(givenFileOrDirPath, path));
    fileManager.write(path, integrated, newPath);
    return;
  }
  fileManager.write(path, integrated);
}

if (cliHandler.shallWatch) {
  console.log("starting to watch");
  watch(files, ((eventType, filePath) => {
    if (eventType === "remove") return;
    const path = resolve(filePath!);
    try {
      fileManager.reloadFromDisk(path);
      let {sourceFile, imports} = fileManager.imports.get(path)!;
      writeSorted(path, sourceFile, imports);
    }
    catch (e) {
      console.warn(e);
    }
  }))
}
