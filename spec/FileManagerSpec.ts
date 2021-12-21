import {join} from "path";
import FileManager from "../src/FileManager";
import {mkdirSync, readFileSync, copyFileSync, writeFileSync} from "fs";
import useTmpDir from "./helpers/useTmpDir";

const tsConfigPath = join(__dirname, "../tsconfig.json");
const exampleFilePath = join(__dirname, "./file-examples/FileManagerReadIn.ts");

describe("FileManager", function() {
  it("should get constructed correctly", function() {
    const fileManager = new FileManager(tsConfigPath, exampleFilePath);
    const [path, {imports}] = Array.from(fileManager.imports.entries())[0];

    expect(fileManager.imports.size).toBe(1);
    expect(path).toBe(exampleFilePath);

    expect(imports.length).toBe(2);
    expect(imports[0].toString())
      .toBe('import elements, {a, b, c} from "package-a";');
    expect(imports[1].toString())
      .toBe('import * as someThing from "package-b";');
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

      // test with the new path
      const newPath = join(tmpPath, "subDir", "file.ts");
      fileManager.write(filePath, content, newPath);
      let newFileContent = readFileSync(newPath, "utf-8");
      expect(fileContent).toMatch(content);
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
});
