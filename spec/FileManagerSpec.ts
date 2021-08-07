import {join} from "path";
import FileManager from "../src/FileManager";

const tsConfigPath = join(__dirname, "../tsconfig.json");
const exampleFilePath = join(__dirname, "./file-examples/FileManagerReadIn.ts");

describe("FileManager", function() {
  it("should get constructed correctly", function () {
    const fileManager = new FileManager(tsConfigPath, exampleFilePath);

    expect(fileManager.imports.length).toBe(1);
    expect(fileManager.imports[0].path).toBe(exampleFilePath);

    const imports = fileManager.imports[0].imports;
    expect(imports.length).toBe(2);
    expect(imports[0].toString())
      .toBe('import elements, {a, b, c} from "package-a";');
    expect(imports[1].toString())
      .toBe('import * as someThing from "package-b";');
  });
});
