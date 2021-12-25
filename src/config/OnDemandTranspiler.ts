import {dirname, resolve} from "path";
import {readFileSync} from "fs";
import {
  CompilerOptions,
  readConfigFile,
  transpile as tsTranspile
} from "typescript";
import ImportCompareFunction from "../sort_rules/ImportCompareFunction";
import ImportElementCompareFunction
  from "../sort_rules/ImportElementCompareFunction";
import SeparateByFunction from "../sort_rules/SeparateByFunction";
import requireFromString from "require-from-string";
import OnDemandTranspileError from "../errors/OnDemandTranspileError";

/** Union type of all functions the transpiler may return. */
export type RequiredFunction =
  ImportCompareFunction | ImportElementCompareFunction | SeparateByFunction;

/**
 * Class for transpiling external injected functions.
 *
 * Functions injected are expected to be written in Typescript and therefore
 * need to be transpiled into Javascript to use them in the code.
 * This class does exactly this.
 */
export default class OnDemandTranspiler {

  // TODO: test me

  /** The compiler options to transpile the files against. */
  private readonly compilerOptions: CompilerOptions;

  /**
   * Constructor
   * @param tsConfig Typescript config object
   * @param configPath Path of the primp config
   */
  constructor(
    tsConfig: {compilerOptions: CompilerOptions},
    private readonly configPath: string | undefined
  ) {
    this.compilerOptions = tsConfig.compilerOptions;
  }

  /**
   * Transpile a file given the source path.
   * @param sourcePath Path of the source
   * @returns A function used to work with other classes
   */
  transpile(sourcePath: string): RequiredFunction {
    if (!this.configPath) throw new OnDemandTranspileError("No config path given");
    let requirePath = resolve(dirname(this.configPath), sourcePath);
    let requireContent;
    try {
      requireContent = readFileSync(requirePath, "utf-8");
    }
    catch (e) {
      throw new OnDemandTranspileError(
        "Could not read the file",
        requirePath
      );
    }

    let transpiled;
    try {
      transpiled = tsTranspile(requireContent, this.compilerOptions);
    }
    catch (e) {
      throw new OnDemandTranspileError(
        "Could not transpile the file",
        requirePath
      );
    }

    try {
      let required = requireFromString(transpiled);
      return required.default;
    }
    catch (e) {
      throw new OnDemandTranspileError(
        "Could not require the function",
        requirePath
      );
    }

  }

}
