import {join} from "path";
import {ModuleKind, ScriptTarget} from "typescript";

import {OnDemandTranspiler} from "../../src/config";
import Import from "../../src/import_management/Import";
import ImportCompareFunction from "../../src/sort_rules/ImportCompareFunction";
import {OnDemandTranspileError} from "../../src/errors";

describe("OnDemandTranspiler", function() {

  const tsConfig = {
    compilerOptions: {
      target: ScriptTarget.ES2021,
      module: ModuleKind.CommonJS
    }
  };
  const configPath = join(__dirname, "./config-files/primp.json");
  const requirePath = "../on-demand-scripts/basic.ts";


  it("should transpile correctly", function() {
    const importA = {source:{name: "A"}} as Import;
    const importB = {source:{name: "B"}} as Import;
    const imports = [importB, importA];

    const transpiler = new OnDemandTranspiler(tsConfig, configPath);

    let transpiled = transpiler.transpile(requirePath);
    expect(transpiled).toBeDefined();
    expect(imports.sort(transpiled as ImportCompareFunction))
      .toEqual([importA, importB]);
  });

  it("should throw the correct errors when transpilation fails", function() {
    let noConfigTranspiler = new OnDemandTranspiler(tsConfig);
    let transpiler = new OnDemandTranspiler(tsConfig, configPath);
    expect(() => noConfigTranspiler.transpile(requirePath))
      .toThrowError("No config path given");

    expect(() => transpiler.transpile("your/mom"))
      .toThrowError("Could not read the file");

    expect(() => transpiler.transpile("../on-demand-scripts/no-require.ts"))
      .toThrowError("Could not require the function");

    expect(() => transpiler.transpile("../on-demand-scripts/no-default.ts"))
      .toThrowError("Transpiled function has no default export");
  })

});
