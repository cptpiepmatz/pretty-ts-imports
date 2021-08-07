import {hideBin} from "yargs/helpers";
import yargs from "yargs/yargs";
import {author} from "../package.json";

/**
 * This class reads in the process arguments and makes them available with the
 * use of yargs.
 */
export default class CLIHandler {

  /** Given file or dir path. */
  givenFileOrDirPath: string;

  /** If primp should run the dirs recursively. */
  shallRecursive: boolean;

  /** Output path, if it should differ. */
  outputPath?: string;

  /** Path for tsconfig.json file. */
  tsConfigPath?: string;

  /** Path for the primp config file. */
  primpConfigPath?: string;

  /** Whether primp should run in watch mode. */
  shallWatch: boolean;

  /**
   * Constructor.
   * Doesn't need any arguments since it uses the argv data from the global
   * {@link process}.
   */
  constructor() {
    // Store the help output yargs generates.
    let yargsHelp: string = "";

    const argv = yargs(hideBin(process.argv))
      .scriptName("primp")
      .usage("Usage: primp [options] <file|directory>")
      .option({
        r: {
          type: "boolean",
          alias: "recursive",
          default: false,
          describe: "read the directory recursively"
        },
        o: {
          type: "string",
          alias: "output",
          describe: "puts the modified files there, instead of in-place"
        },
        t: {
          type: "string",
          alias: "tsconfig",
          describe: "path to your tsconfig"
        },
        c: {
          type: "string",
          alias: "config",
          describe: "path to your primp config"
        },
        w: {
          type: "boolean",
          alias: "watch",
          default: false,
          describe: "starts primp in watch mode"
        },
        _: {
          type: "string",
          demandOption: true
        }
      })
      .epilog(`Tool written by ${author}`)
      .showHelp(help => yargsHelp = help)
      .parseSync();

    this.givenFileOrDirPath = argv._[0];
    this.shallRecursive = argv.r;
    this.outputPath = argv.o;
    this.tsConfigPath = argv.t;
    this.primpConfigPath = argv.c;
    this.shallWatch = argv.w;

    if (!this.givenFileOrDirPath) {
      console.log(yargsHelp);
      process.exit(1);
    }
  }

}
