import {join} from "path";
import FileManager from "../src/FileManager";
import {copyFileSync, readFileSync, statSync, writeFileSync} from "fs";
import useTmpDir from "./helpers/useTmpDir";

const tsConfigPath = join(__dirname, "../tsconfig.json");
const exampleFilePath = join(__dirname, "./file-examples/FileManagerReadIn.ts");
const invalidPath = "https://cptpiepmatz.de";

describe("FileManager", function() {
  it("should get constructed correctly", function() {
    const fileManager = new FileManager(tsConfigPath, exampleFilePath);
    const [path, {imports}] = Array.from(fileManager.imports.entries())[0];

    expect(fileManager.imports.size).toBe(1);
    expect(path).toBe(exampleFilePath);

    expect(imports).toHaveSize(2);
    expect(imports[0].toString())
      .toBe('import elements, {a, b, c} from "package-a";');
    expect(imports[1].toString())
      .toBe('import * as someThing from "package-b";');
  });

  it("should throw an error if no ts config could be found", function() {
    expect(() => {
      new FileManager(invalidPath, "");
    }).toThrowError();
  });

  it("should find files correctly", function() {
    const startPath = join(__dirname, "./file-examples");
    const expectedNonRecursive = [
      join(startPath, "FileManagerReadIn.ts")
    ];
    const expectedRecursive = [
      join(startPath, "deeper-path", "empty.ts")
    ].concat(expectedNonRecursive);

    expect(FileManager.getFiles(startPath)).toEqual(expectedNonRecursive);
    expect(FileManager.getFiles(startPath, true)).toEqual(expectedRecursive);

    // test if the file is directly returned if pointing to a file
    const directPath = join(startPath, "FileManagerReadIn.ts");
    expect(FileManager.getFiles(directPath)).toEqual(directPath);

    // test for the error
    expect(() => FileManager.getFiles(invalidPath)).toThrowError();
  });

  it("should write the files correctly", function() {
    useTmpDir(tmpPath => {
      const filePath = join(tmpPath, "file.ts");
      copyFileSync(
        join(__dirname, "./file-examples/FileManagerReadIn.ts"),
        filePath
      );
      const fileManager = new FileManager(tsConfigPath, filePath);

      // test using write without new path
      const content = "some content";
      fileManager.write(filePath, content);
      let fileContent = readFileSync(filePath, "utf-8");
      expect(fileContent).toMatch(content);

      // test if the file updates if no content is new
      fileManager.reloadFromDisk(filePath);
      let fileStats = statSync(filePath);
      fileManager.write(filePath, content);
      let updatedStats = statSync(filePath);
      expect(fileStats.mtime).toEqual(updatedStats.mtime);

      // test with the new path
      const newPath = join(tmpPath, "file.ts");
      fileManager.write(filePath, content, newPath);
      let newFileContent = readFileSync(newPath, "utf-8");
      expect(newFileContent).toMatch(content);
    });
  });

  it("should reload files correctly", function() {
    useTmpDir(tmpPath => {
      const filePath = join(tmpPath, "file.ts");
      copyFileSync(
        join(__dirname, "./file-examples/FileManagerReadIn.ts"),
        filePath
      );
      const fileManager = new FileManager(tsConfigPath, filePath);
      const newText = '"import * from "lol"';

      const oldContent = Array.from(fileManager.imports.values())[0].sourceFile.text;
      writeFileSync(filePath, newText);
      fileManager.reloadFromDisk(filePath);
      const newContent = Array.from(fileManager.imports.values())[0].sourceFile.text;

      // check if reloading makes changes
      expect(newContent).not.toMatch(oldContent);

      // check if new content is correct
      expect(newText).toContain(newContent);
    });
  });

  it("should throw an error if the file could not be loaded", function() {
    const fileManager = new FileManager(tsConfigPath, exampleFilePath);
    expect(() => {
      fileManager.reloadFromDisk(invalidPath);
    }).toThrowError();
  });
});
