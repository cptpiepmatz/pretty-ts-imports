import SeparateByFunction from "../sort_rules/SeparateByFunction";
import {builtinSeparateByFunctions} from "../sort_rules/builtins";
import Import from "./Import";
import InvalidConfigError from "../errors/InvalidConfigError";

/** Class to insert the separators into the imports. */
export default class ImportSeparator {
  // TODO: test me

  /**
   * Array of separate by rules.
   * Order is not relevant.
   */
  readonly separateByRules: SeparateByFunction[] = [];

  /**
   * Constructor with only separate by rules.
   * @param separateByRules Array of separate by rules
   */
  constructor(separateByRules: string[]);
  /**
   * Constructor including external functions.
   * @param separateByRules Array of separate by rules
   * @param requireFunctions Record of external functions by their function name
   */
  constructor(
    separateByRules: string[],
    requireFunctions: Record<string, SeparateByFunction>
  );
  constructor(
    separateByRules: string[],
    requireFunctions?: Record<string, SeparateByFunction>
  ) {
    let separateByFunctions = Object.assign(
      {},
      builtinSeparateByFunctions,
      requireFunctions
    );
    for (let separateByRule of separateByRules ) {
      // insert the rules into the usable separate by functions
      type rule = keyof typeof separateByFunctions;
      if (!separateByFunctions[separateByRule as rule]) {
        throw new InvalidConfigError(
          "Could not find separate by function.",
          "separateBy",
          separateByRule
        );
      }
      this.separateByRules.push(separateByFunctions[separateByRule as rule]);
    }
  }

  /**
   * Given two imports, this will decide if a separator should be placed in
   * between according to the separate by rules.
   *
   * If at least one of them is not an import no more separator are needed.
   * @param a Import A
   * @param b Import B
   * @private
   */
  private decideSeparator(
    a: Import | undefined | null,
    b: Import | undefined | null
  ): boolean {
    if (!a || !b) return false;
    for (let rule of this.separateByRules) {
      // check if one of the rules asks for a separator
      if (rule(a, b)) return true;
    }
    return false;
  }

  /**
   * Inserts the null elements as separator in an array of imports.
   * @param imports Array of imports to insert the separator
   */
  insertSeparator(imports: Import[]): (Import | null)[] {
    let separatedImports: (Import | null)[] = [imports[0]];
    for (let imported of imports.slice(1)) {
      let popped = separatedImports.pop();
      separatedImports.push(popped!);
      if (this.decideSeparator(popped, imported)) {
        // the separator is a null value
        separatedImports.push(null);
      }
      separatedImports.push(imported);
    }
    return separatedImports;
  }
}
