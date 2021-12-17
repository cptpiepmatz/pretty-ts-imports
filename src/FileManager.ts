import detectNewline from "detect-newline";
import {
  accessSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from "fs";
import {dirname, join, resolve} from "path";
import {
  ImportDeclaration,
  SourceFile,
  SyntaxKind,
  createSourceFile,
  findConfigFile,
  readConfigFile
} from "typescript";

import CLIOptionsError from "./errors/CLIOptionsError";
import MissingFileError from "./errors/MissingFileError";
import Import from "./import_management/Import";

/**
 * Class holding all the imports from the given paths.
 */
export default class FileManager {

  /** The typescript config. */
  readonly tsConfig: ReturnType<typeof readConfigFile>;

  /** The imported files in their read in form. */
  readonly imports: Map<string, {sourceFile: SourceFile, imports: Import[]}> = new Map();

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
    if (!configPath) throw new MissingFileError("Couldn't find tsconfig.");
    this.tsConfig = readConfigFile(configPath, FileManager.readFile);

    // Read the .ts files.
    filePaths = [filePaths].flat();
    const files: {path: string, content: string}[] = [];
    for (let filePath of filePaths) {
      this.reloadFromDisk(filePath);
    }

  }

  /**
   * Read the files from the disk.
   * Also used in the constructor.
   * @param path Path for the file to read in
   */
  reloadFromDisk(path: string) {
    const fullPath = resolve(path);
    const content = FileManager.readFile(fullPath);
    if (!content) throw new MissingFileError("Couldn't find file.", fullPath);
    const sourceFile = createSourceFile(
      fullPath,
      content,
      this.tsConfig.config.compilerOptions.target
    );
    const imports: Import[] = [];
    for (let statement of sourceFile.statements) {
      if (statement.kind !== SyntaxKind.ImportDeclaration) break;
      imports.push(
        new Import(statement as ImportDeclaration, sourceFile)
      );
    }
    this.imports.set(fullPath, {sourceFile, imports});
  }

  /**
   * Writes the new content into the path.
   * @param path Path of the file
   * @param newContent The new content
   * @param newPath If given, the new entry point path
   */
  write(path: string, newContent: string, newPath?: string) {
    let entry = this.imports.get(resolve(path));
    if (entry!.sourceFile.text === newContent) return;
    const eol = detectNewline(entry!.sourceFile.text) ?? "\n";
    mkdirSync(dirname(newPath ?? path), {recursive: true});
    writeFileSync(
      newPath ?? path,
      newContent.replaceAll(/\r?\n/g, eol)
    );
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

  /**
   * Given a path to whether a file or a directory, this finds all the .ts
   * files. If the path is a directory, it will return all .ts files in that
   * directory. If recursive is true, it will search the directory recursively.
   * Accepts wildcards.
   * @param path Path to a file or directory.
   * @param recursive If this should work recursively.
   */
  static getFiles(path: string, recursive?: boolean): string | string[] {
    const stat = statSync(path);
    if (stat.isFile()) return path;
    if (stat.isDirectory()) {
      let filePaths: string[] = [];
      if (recursive) {
        for (let innerPath of readdirSync(path)) {
          filePaths = filePaths
            .concat(FileManager.getFiles(join(path, innerPath), true));
        }
      }
      else {
        for (let innerPath of readdirSync(path)) {
          const joinedInnerPath = join(path, innerPath);
          const innerStat = statSync(joinedInnerPath);
          if (innerStat.isFile()) filePaths.push(joinedInnerPath);
        }
      }
      return filePaths;
    }
    throw new CLIOptionsError(
      "Given path is neither a file nor a directory.",
      "_",
      path
    );
  }
}
