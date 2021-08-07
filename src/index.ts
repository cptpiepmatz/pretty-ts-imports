import CLIHandler from "./CLIHandler";
import FileManager from "./FileManager";

const cliHandler = new CLIHandler();
console.log(FileManager.getFiles(
  cliHandler.givenFileOrDirPath,
  cliHandler.shallRecursive
));
