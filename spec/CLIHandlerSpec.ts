import CLIHandler from "../src/CLIHandler";

let spyData: object;

describe("CLIHandler", function() {

  it(
    "exit the process with code 1 if no arguments are given",
    function() {
      process.argv = ["node", "cli"];
      let exitCode: number;
      spyOn(process, "exit")
        .withArgs(1).and
        // @ts-ignore the functions returns never, so we need this for the mock
        .callFake((code) => expect(code).toBe(1));
      spyOn(console, "log"); // shut up, please

      const cliHandler = new CLIHandler();
    }
  );

  it("should store given parameters", function() {
    process.argv = [
      "node", "cli",
      "--recursive",
      "--output", "outputPath",
      "--tsconfig", "tsConfigPath",
      "--config", "configPath",
      "--watch",
      "dir"
    ];
    const cliHandler = new CLIHandler();
    expect(cliHandler.givenFileOrDirPath).toBe("dir");
    expect(cliHandler.shallRecursive).toBeTrue();
    expect(cliHandler.outputPath).toBe("outputPath");
    expect(cliHandler.tsConfigPath).toBe("tsConfigPath");
    expect(cliHandler.primpConfigPath).toBe("configPath");
    expect(cliHandler.shallWatch).toBeTrue();
  });

  it(
    "should have the correct default values, if only path is given",
    function() {
      process.argv = ["node", "cli", "file"];
      const cliHandler = new CLIHandler();
      expect(cliHandler.givenFileOrDirPath).toBe("file");
      expect(cliHandler.shallRecursive).toBeFalse();
      expect(cliHandler.outputPath).toBeUndefined();
      expect(cliHandler.tsConfigPath).toBeUndefined();
      expect(cliHandler.primpConfigPath).toBeUndefined();
      expect(cliHandler.shallWatch).toBeFalse();
    }
  );
});
