import {
  createSourceFile,
  findConfigFile,
  readConfigFile,
  parseConfigFileTextToJson,
  SourceFile,
  SyntaxKind, ImportDeclaration
} from "typescript";
import {accessSync, readFileSync} from "fs";
import Import from "./import_management/Import";

export default class FileManager {

  readonly imports: {path: string, imports: Import[]}[] = [];

  constructor(tsconfigPath: string, filePaths: string | string[]) {
    const configPath = findConfigFile(tsconfigPath, FileManager.fileExists);
    if (!configPath) throw new Error("Couldn't find tsconfig");
    const config = readConfigFile(configPath, FileManager.readFile).config;

    filePaths = [filePaths].flat();
    const files: {path: string, content: string}[] = [];
    for (let filePath of filePaths) {
      const content = FileManager.readFile(filePath);
      if (!content) throw new Error("Couldn't read in " + filePath);
      files.push({
        path: filePath,
        content: content
      });
    }

    const sourceFiles: {path: string, sourceFile: SourceFile}[] = [];
    for (let file of files) {
      sourceFiles.push({
        path: file.path,
        sourceFile: createSourceFile(file.path, file.content, config.target)
      });
    }

    for (let sourceFile of sourceFiles) {
      const imports: Import[] = [];
      for (let statement of sourceFile.sourceFile.statements) {
        if (statement.kind !== SyntaxKind.ImportDeclaration) break;
        imports.push(
          new Import(statement as ImportDeclaration, sourceFile.sourceFile)
        );
      }
      this.imports.push({
        path: sourceFile.path,
        imports: imports
      });
    }
  }

  /**
   * Checks if the file exists. (Hopefully)
   * @param fileName The name of the file
   * @private
   */
  private static fileExists(fileName: string): boolean {
    try {
      accessSync(fileName);
      return true;
    }
    catch (e) {
      return false;
    }
  }

  /**
   * Reads the file from a given path.
   * @param path The path to read from.
   * @private
   */
  private static readFile(path: string): string | undefined {
    try {
      return readFileSync(path, "utf8");
    }
    catch (e) {
      return;
    }
  }
}
