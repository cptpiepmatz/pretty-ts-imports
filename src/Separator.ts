import SeparateByFunction from "./sort_rules/SeparateByFunction";
import {
  builtinSeparateByFunctions
} from "./sort_rules/builtins/builtinSeparateByFunctions";
import Import from "./import_management/Import";

export default class Separator {
  // TODO: doc me
  // TODO: test me

  readonly separateByRules: SeparateByFunction[] = [];

  constructor(
    separateByRules: string[],
  );
  constructor(
    separateByRules: string[],
    configPath: string,
    requireFunctions: Record<string, string>
  );
  constructor(
    separateByRules: string[],
    configPath?: string,
    requireFunctions?: Record<string, string>
  ) {
    for (let separateByRule of separateByRules) {
      if (!builtinSeparateByFunctions[separateByRule]) {
        throw new Error("Could not find separate by function: " + separateByRule);
      }
      this.separateByRules.push(builtinSeparateByFunctions[separateByRule]);
    }
  }

  private decideSeparator(
    a: Import | undefined | null,
    b: Import | undefined | null
  ): boolean {
    if (!a || !b) return false;
    for (let rule of this.separateByRules) {
      if (rule(a, b)) return true;
    }
    return false;
  }

  insertSeparator(imports: Import[]): (Import | null)[] {
    // TODO: use this in index
    let separatedImports: (Import | null)[] = [imports[0]];
    for (let imported of imports.slice(1)) {
      let popped = separatedImports.pop();
      separatedImports.push(popped!);
      if (this.decideSeparator(popped, imported)) {
        separatedImports.push(null);
      }
      separatedImports.push(imported);
    }
    return separatedImports;
  }
}
