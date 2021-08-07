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

/**
 * Class holding all the imports from the given paths.
 */
export default class FileManager {

  /** The imported files in their read in form. */
  readonly imports: {path: string, imports: Import[]}[] = [];

  /**
   * Constructor.
   * This takes a ts config to search for it's target and some file paths to
   * read them in and construct {@link Import}s from.
   * @param tsconfigPath The path for the ts config
   * @param filePaths One or many file paths for the .ts files
   */
  constructor(tsconfigPath: string, filePaths: string | string[]) {
    // Read the ts config.
    const configPath = findConfigFile(tsconfigPath, FileManager.fileExists);
    if (!configPath) throw new Error("Couldn't find tsconfig");
    const config = readConfigFile(configPath, FileManager.readFile).config;

    // Read the .ts files.
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

    // Create source files from them.
    const sourceFiles: {path: string, sourceFile: SourceFile}[] = [];
    for (let file of files) {
      sourceFiles.push({
        path: file.path,
        sourceFile: createSourceFile(
          file.path,
          file.content,
          config.compilerOptions.target
        )
      });
    }

    // Make imports out of them.
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
