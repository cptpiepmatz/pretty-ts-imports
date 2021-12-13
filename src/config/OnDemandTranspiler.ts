import {dirname, join, resolve} from "path";
import {readFileSync} from "fs";
import {parse} from "json5";
import {CompilerOptions} from "typescript";
import ImportCompareFunction from "../sort_rules/ImportCompareFunction";
import ImportElementCompareFunction
  from "../sort_rules/ImportElementCompareFunction";
import SeparateByFunction from "../sort_rules/SeparateByFunction";
import {transpile as tsTranspile} from "typescript";
import requireFromString from "require-from-string";
import OnDemandTranspileError from "../errors/OnDemandTranspileError";

/** Union type of all functions the transpiler may return. */
export type RequiredFunction =
  ImportCompareFunction | ImportElementCompareFunction | SeparateByFunction;

export default class OnDemandTranspiler {

  // TODO: doc me
  // TODO: test me

  private readonly compilerOptions: CompilerOptions;
  private readonly configPath: string | undefined;

  constructor(tsConfigPath: string, configPath: string | undefined) {
    this.configPath = configPath;
    let tsConfigContent = readFileSync(
      join(__dirname, "../../tsconfig.json"),
      "utf8"
    );
    let tsConfigObject = parse(tsConfigContent);
    this.compilerOptions = tsConfigObject.compilerOptions as any;
  }

  /**
   * Transpile a file given the source path.
   * @param sourcePath Path of the source
   * @returns A function used to work with other classes
   */
  transpile(sourcePath: string): RequiredFunction {
    // TODO: add some more detection if something is wrong
    if (!this.configPath) throw new OnDemandTranspileError("No config path given");
    let requirePath = resolve(dirname(this.configPath), sourcePath);
    let requireContent = readFileSync(requirePath, "utf-8");
    let transpiled = tsTranspile(requireContent, this.compilerOptions);
    let required = requireFromString(transpiled);
    return required.default;
  }

}
