(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports={
    "name": "pretty-ts-imports",
    "version": "0.1.0",
    "description": "",
    "main": "./dist/lib.bundle.min.js",
    "sourceMap": "./dist/lib.bundle.min.js.map",
    "types": "./dist/lib.d.ts",
    "bin": {
        "pretty-ts-imports": "./bin/pretty-ts-imports",
        "primp": "./bin/primp"
    },
    "scripts": {
        "test": "jasmine-ts",
        "coverage": "nyc jasmine-ts",
        "run-dev": "ts-node src/cli.ts",
        "build": "npm run build:clean && npm run build:tsc && npm run build-cli:bundle && npm run build-cli:minify && npm run build-lib:bundle && npm run build-lib:minify && npm run build-lib:types",
        "build:clean": "del-cli dist & del-cli out",
        "build:tsc": "tsc",
        "build-cli:bundle": "browserify out/src/cli.js --node -o dist/cli.bundle.js --no-bundle-external",
        "build-cli:minify": "terser dist/cli.bundle.js -o dist/cli.bundle.min.js --source-map",
        "build-lib:types": "npm-dts generate -e src/lib.ts -o dist/lib.d.ts -t tmp/dts -L warn",
        "build-lib:bundle": "browserify out/src/lib.js --node -o dist/lib.bundle.js --no-bundle-external",
        "build-lib:minify": "terser dist/lib.bundle.js -o dist/lib.bundle.min.js --source-map",
        "schema:config": "typescript-json-schema src/config/Config.ts Config --tsNodeRegister -o config.schema.json",
        "schema": "npm run schema:config",
        "docs": "typedoc"
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/derPiepmatz/pretty-ts-imports.git"
    },
    "author": "Tim 'Piepmatz' Hesse",
    "license": "ISC",
    "bugs": {
        "url": "https://github.com/derPiepmatz/pretty-ts-imports/issues"
    },
    "homepage": "https://github.com/derPiepmatz/pretty-ts-imports#readme",
    "dependencies": {
        "detect-newline": "<4.0.0",
        "json5": "^2.2.0",
        "node-watch": "^0.7.2",
        "require-from-string": "^2.0.2",
        "typescript": "^4.5.2",
        "yaml": "^1.10.2",
        "yargs": "^17.3.0"
    },
    "devDependencies": {
        "@types/jasmine": "^3.10.2",
        "@types/node": "^16.11.11",
        "@types/require-from-string": "^1.2.1",
        "@types/yargs": "^17.0.7",
        "browserify": "^17.0.0",
        "del-cli": "^4.0.1",
        "jasmine": "^3.10.0",
        "jasmine-ts": "^0.4.0",
        "npm-dts": "^1.3.10",
        "nyc": "^15.1.0",
        "terser": "^5.10.0",
        "ts-node": "^10.4.0",
        "typedoc": "^0.22.10",
        "typedoc-plugin-extras": "^2.2.3",
        "typescript-json-schema": "^0.52.0"
    }
}

},{}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("yargs/helpers");
const yargs_1 = __importDefault(require("yargs/yargs"));
const package_json_1 = require("../package.json");
/**
 * This class reads in the process arguments and makes them available with the
 * use of yargs.
 */
class CLIHandler {
    /**
     * Constructor.
     * Doesn't need any arguments since it uses the argv data from the global
     * {@link process}.
     */
    constructor() {
        // Store the help output yargs generates.
        let yargsHelp = "";
        const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
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
            .epilog(`Tool written by ${package_json_1.author}`)
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
exports.default = CLIHandler;

},{"../package.json":1,"yargs/helpers":undefined,"yargs/yargs":undefined}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const detect_newline_1 = __importDefault(require("detect-newline"));
const fs_1 = require("fs");
const path_1 = require("path");
const typescript_1 = require("typescript");
const CLIOptionsError_1 = __importDefault(require("./errors/CLIOptionsError"));
const MissingFileError_1 = __importDefault(require("./errors/MissingFileError"));
const Import_1 = __importDefault(require("./import_management/Import"));
/**
 * Class holding all the imports from the given paths.
 */
class FileManager {
    /**
     * Constructor.
     * This takes a ts config to search for it's target and some file paths to
     * read them in and construct {@link Import}s from.
     * @param tsconfigPath The path for the ts config
     * @param filePaths One or many file paths for the .ts files
     */
    constructor(tsconfigPath, filePaths) {
        /** The imported files in their read in form. */
        this.imports = new Map();
        // Read the ts config.
        const configPath = (0, typescript_1.findConfigFile)(tsconfigPath, FileManager.fileExists);
        if (!configPath)
            throw new MissingFileError_1.default("Couldn't find tsconfig.");
        // TODO: handle the error attribute
        this.tsConfig = (0, typescript_1.readConfigFile)(configPath, FileManager.readFile).config;
        // Read the .ts files.
        filePaths = [filePaths].flat();
        const files = [];
        for (let filePath of filePaths) {
            this.reloadFromDisk(filePath);
        }
    }
    /**
     * Read the files from the disk.
     * Also used in the constructor.
     * @param path Path for the file to read in
     */
    reloadFromDisk(path) {
        const fullPath = (0, path_1.resolve)(path);
        let content;
        try {
            content = (0, fs_1.readFileSync)(fullPath, "utf-8");
        }
        catch (e) {
            throw new MissingFileError_1.default("Couldn't find file.", fullPath);
        }
        const sourceFile = (0, typescript_1.createSourceFile)(fullPath, content, this.tsConfig.compilerOptions.target);
        const imports = [];
        for (let statement of sourceFile.statements) {
            if (statement.kind !== typescript_1.SyntaxKind.ImportDeclaration)
                break;
            imports.push(new Import_1.default(statement, sourceFile));
        }
        this.imports.set(fullPath, { sourceFile, imports });
    }
    /**
     * Writes the new content into the path.
     * @param path Path of the file
     * @param newContent The new content
     * @param newPath If given, the new entry point path
     */
    write(path, newContent, newPath) {
        let entry = this.imports.get((0, path_1.resolve)(path));
        if (entry.sourceFile.text === newContent)
            return;
        /* istanbul ignore next */
        const eol = (0, detect_newline_1.default)(entry.sourceFile.text) ?? "\n";
        (0, fs_1.mkdirSync)((0, path_1.dirname)(newPath ?? path), { recursive: true });
        (0, fs_1.writeFileSync)(newPath ?? path, newContent.replaceAll(/\r?\n/g, eol));
    }
    /**
     * Checks if the file exists. (Hopefully)
     * @param fileName The name of the file
     * @private
     */
    static fileExists(fileName) {
        try {
            (0, fs_1.accessSync)(fileName);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    /**
     * Reads the file from a given path.
     * @param path The path to read from.
     * @private
     */
    static readFile(path) {
        try {
            return (0, fs_1.readFileSync)(path, "utf8");
        }
        catch (e) {
            /* istanbul ignore next */
            return;
        }
    }
    /**
     * Given a path to whether a file or a directory, this finds all the .ts
     * files. If the path is a directory, it will return all .ts files in that
     * directory. If recursive is true, it will search the directory recursively.
     * Accepts wildcards.
     * @param path Path to a file or directory.
     * @param recursive If this should work recursively.
     */
    static getFiles(path, recursive) {
        try {
            const stat = (0, fs_1.statSync)(path);
            if (stat.isFile())
                return path;
            /* istanbul ignore next */
            if (stat.isDirectory()) {
                let filePaths = [];
                if (recursive) {
                    for (let innerPath of (0, fs_1.readdirSync)(path)) {
                        filePaths = filePaths
                            .concat(FileManager.getFiles((0, path_1.join)(path, innerPath), true));
                    }
                }
                else {
                    for (let innerPath of (0, fs_1.readdirSync)(path)) {
                        const joinedInnerPath = (0, path_1.join)(path, innerPath);
                        const innerStat = (0, fs_1.statSync)(joinedInnerPath);
                        if (innerStat.isFile())
                            filePaths.push(joinedInnerPath);
                    }
                }
                return filePaths;
            }
        }
        catch (e) { }
        throw new CLIOptionsError_1.default("Given path is neither a file nor a directory.", "_", path);
    }
}
exports.default = FileManager;

},{"./errors/CLIOptionsError":9,"./errors/MissingFileError":12,"./import_management/Import":15,"detect-newline":undefined,"fs":undefined,"path":undefined,"typescript":undefined}],4:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_watch_1 = __importDefault(require("node-watch"));
const path_1 = require("path");
const CLIHandler_1 = __importDefault(require("./CLIHandler"));
const FileManager_1 = __importDefault(require("./FileManager"));
const ConfigHandler_1 = __importDefault(require("./config/ConfigHandler"));
const OnDemandTranspiler_1 = __importDefault(require("./config/OnDemandTranspiler"));
const ImportIntegrator_1 = __importDefault(require("./import_management/ImportIntegrator"));
const ImportSeparator_1 = __importDefault(require("./import_management/ImportSeparator"));
const ImportSorter_1 = __importDefault(require("./import_management/ImportSorter"));
// TODO: get some fancy logging
const cliHandler = new CLIHandler_1.default();
const { givenFileOrDirPath, shallRecursive, primpConfigPath, outputPath } = cliHandler;
const files = FileManager_1.default.getFiles(givenFileOrDirPath, shallRecursive);
const tsConfigPath = cliHandler.tsConfigPath ?? process.cwd();
const fileManager = new FileManager_1.default(tsConfigPath, files);
const configPath = primpConfigPath ?? ConfigHandler_1.default.findConfig(givenFileOrDirPath);
const configHandler = new ConfigHandler_1.default(configPath);
const requiredRecord = {};
if (configPath) {
    const onDemandTranspiler = new OnDemandTranspiler_1.default(fileManager.tsConfig, configPath);
    for (const [name, path] of Object.entries(configHandler.require)) {
        requiredRecord[name] = onDemandTranspiler.transpile(path);
    }
}
const { sortImports, sortImportElements } = configHandler;
const sorter = new ImportSorter_1.default(sortImports, sortImportElements, requiredRecord);
const separator = new ImportSeparator_1.default(configHandler.separateBy, requiredRecord);
const integrator = new ImportIntegrator_1.default(configHandler.formatting);
for (let [path, { sourceFile, imports }] of fileManager.imports.entries()) {
    writeSorted(path, sourceFile, imports);
}
function writeSorted(path, sourceFile, imports) {
    sorter.sort(imports);
    let integrated = integrator.integrate(sourceFile, separator.insertSeparator(imports));
    if (outputPath) {
        let newPath = (0, path_1.join)(outputPath, (0, path_1.relative)(givenFileOrDirPath, path));
        fileManager.write(path, integrated, newPath);
        return;
    }
    fileManager.write(path, integrated);
}
if (cliHandler.shallWatch) {
    console.log("starting to watch");
    (0, node_watch_1.default)(files, ((eventType, filePath) => {
        if (eventType === "remove")
            return;
        const path = (0, path_1.resolve)(filePath);
        try {
            fileManager.reloadFromDisk(path);
            let { sourceFile, imports } = fileManager.imports.get(path);
            writeSorted(path, sourceFile, imports);
        }
        catch (e) {
            console.warn(e);
        }
    }));
}

},{"./CLIHandler":2,"./FileManager":3,"./config/ConfigHandler":5,"./config/OnDemandTranspiler":6,"./import_management/ImportIntegrator":16,"./import_management/ImportSeparator":17,"./import_management/ImportSorter":18,"node-watch":undefined,"path":undefined}],5:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectedConfigNames = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const JSON5 = __importStar(require("json5"));
const YAML = __importStar(require("yaml"));
const defaultConfig_1 = require("./defaultConfig");
const SupportedConfigFormat_1 = __importDefault(require("./SupportedConfigFormat"));
const UnsupportedFileFormatError_1 = __importDefault(require("../errors/UnsupportedFileFormatError"));
/** Expected config file names. ("primp" is recommended.) */
exports.expectedConfigNames = [
    "primp",
    "pretty-ts-imports",
    "prettyTsImports".toLowerCase()
];
/**
 * Class for handling the config files.
 * It parses the config and makes the options of them available.
 * If the parsed config misses some options the defaults will be used.
 */
class ConfigHandler {
    /**
     * Constructor.
     * Reads and parses a config file and makes the options of it public.
     * @param configPath
     */
    constructor(configPath) {
        let config = {};
        if (configPath) {
            let configContent = (0, fs_1.readFileSync)(configPath, "utf-8");
            switch ((0, path_1.extname)(configPath)) {
                case SupportedConfigFormat_1.default.JSON:
                    config = JSON.parse(configContent);
                    break;
                case SupportedConfigFormat_1.default.JSON5:
                    config = JSON5.parse(configContent);
                    break;
                case SupportedConfigFormat_1.default.YML:
                case SupportedConfigFormat_1.default.YAML:
                    config = YAML.parse(configContent);
                    break;
                default:
                    throw new UnsupportedFileFormatError_1.default(configPath);
            }
        }
        this.sortImports = config.sortImports ?? defaultConfig_1.defaultSortImports;
        this.sortImportElements = config.sortImportElements ?? defaultConfig_1.defaultSortImportElements;
        this.separateBy = config.separateBy ?? defaultConfig_1.defaultSeparateBy;
        this.require = config.require ?? {};
        this.formatting = Object.assign({}, defaultConfig_1.defaultFormatting, config.formatting);
    }
    /**
     * Checks if a config path points to a supported config file name.
     * @param configPath Path to check for
     */
    static isSupportedConfigFile(configPath) {
        let ext = (0, path_1.extname)(configPath);
        if (Object.values(SupportedConfigFormat_1.default).includes(ext)) {
            if (exports.expectedConfigNames.includes((0, path_1.basename)(configPath, ext).toLowerCase())) {
                return true;
            }
        }
        return false;
    }
    /**
     * Tries to find a config file from the give entry point.
     * @param entryPoint
     */
    static findConfig(entryPoint) {
        let stat = (0, fs_1.statSync)(entryPoint);
        if (stat.isFile()) {
            // maybe the file is config file
            if (ConfigHandler.isSupportedConfigFile(entryPoint)) {
                return entryPoint;
            }
        }
        if (stat.isDirectory()) {
            // check all files in the directory for a config
            let files = (0, fs_1.readdirSync)(entryPoint);
            for (let file of files) {
                if (ConfigHandler.isSupportedConfigFile(file)) {
                    return file;
                }
            }
            // if none is found, go up one directory
            let upper = (0, path_1.dirname)(entryPoint);
            if (upper === entryPoint) {
                // if there is no more to go up, there may be no config
                return undefined;
            }
            return ConfigHandler.findConfig(upper);
        }
        return undefined;
    }
}
exports.default = ConfigHandler;

},{"../errors/UnsupportedFileFormatError":14,"./SupportedConfigFormat":7,"./defaultConfig":8,"fs":undefined,"json5":undefined,"path":undefined,"yaml":undefined}],6:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const require_from_string_1 = __importDefault(require("require-from-string"));
const typescript_1 = require("typescript");
const OnDemandTranspileError_1 = __importDefault(require("../errors/OnDemandTranspileError"));
/**
 * Class for transpiling external injected functions.
 *
 * Functions injected are expected to be written in Typescript and therefore
 * need to be transpiled into Javascript to use them in the code.
 * This class does exactly this.
 */
class OnDemandTranspiler {
    /**
     * Constructor
     * @param tsConfig Typescript config object
     * @param configPath Path of the primp config
     */
    constructor(tsConfig, configPath) {
        this.configPath = configPath;
        this.compilerOptions = tsConfig.compilerOptions;
    }
    /**
     * Transpile a file given the source path.
     * @param sourcePath Path of the source
     * @returns A function used to work with other classes
     */
    transpile(sourcePath) {
        if (!this.configPath)
            throw new OnDemandTranspileError_1.default("No config path given");
        let requirePath = (0, path_1.resolve)((0, path_1.dirname)(this.configPath), sourcePath);
        let requireContent;
        try {
            requireContent = (0, fs_1.readFileSync)(requirePath, "utf-8");
        }
        catch (e) {
            throw new OnDemandTranspileError_1.default("Could not read the file", requirePath);
        }
        let transpiled = (0, typescript_1.transpile)(requireContent, this.compilerOptions);
        let required;
        try {
            required = (0, require_from_string_1.default)(transpiled);
        }
        catch (e) {
            throw new OnDemandTranspileError_1.default("Could not require the function", requirePath);
        }
        if (required.default)
            return required.default;
        throw new OnDemandTranspileError_1.default("Transpiled function has no default export", requirePath);
    }
}
exports.default = OnDemandTranspiler;

},{"../errors/OnDemandTranspileError":13,"fs":undefined,"path":undefined,"require-from-string":undefined,"typescript":undefined}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Supported config file formats. */
var SupportedConfigFormat;
(function (SupportedConfigFormat) {
    SupportedConfigFormat["JSON"] = ".json";
    SupportedConfigFormat["JSON5"] = ".json5";
    SupportedConfigFormat["YML"] = ".yml";
    SupportedConfigFormat["YAML"] = ".yaml";
})(SupportedConfigFormat || (SupportedConfigFormat = {}));
exports.default = SupportedConfigFormat;

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultFormatting = exports.defaultSeparateBy = exports.defaultSortImportElements = exports.defaultSortImports = void 0;
/** Default config. */
const defaultConfig = {
    sortImports: [
        "sourceType",
        "!namespacePresence",
        "pathName",
        "sourceName"
    ],
    sortImportElements: [
        "elementType",
        "basenameGroup",
        "elementName"
    ],
    separateBy: [
        "unequalPackageState",
        "unequalNamespaceUse"
    ],
    formatting: {
        bracketIndent: 0,
        indent: 2,
        maxColumns: 80,
        quoteStyle: "double"
    },
    require: {}
};
/** Default compare functions to sort elements. */
exports.defaultSortImports = defaultConfig.sortImports;
/** Default compare functions to sort import elements. */
exports.defaultSortImportElements = defaultConfig.sortImportElements;
/** Default compare functions to group imports. */
exports.defaultSeparateBy = defaultConfig.separateBy;
/** Default formatting options. */
exports.defaultFormatting = defaultConfig.formatting;
exports.default = defaultConfig;

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class for errors that are caused by bad cli options. */
class CLIOptionsError extends Error {
    /**
     * Constructor.
     * @param message Message for the error
     * @param cliOption The option that caused the error
     * @param cliValue The value passed to the option
     */
    constructor(message, cliOption, cliValue) {
        super(message);
        this.cliOption = cliOption;
        this.cliValue = cliValue;
    }
}
exports.default = CLIOptionsError;

},{}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class if something in the integration failed. */
class IntegrationError extends Error {
    /**
     * Constructor
     * @param message Message of the error
     * @param sourceText Source text that failed the integration
     */
    constructor(message, sourceText) {
        super(message);
        this.sourceText = sourceText;
    }
}
exports.default = IntegrationError;

},{}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class for invalid config files. */
class InvalidConfigError extends Error {
    /**
     * Constructor.
     * @param message Message of the error
     * @param configKey The name of the key that is invalid
     * @param configValue The value in the config that is invalid
     */
    constructor(message, configKey, configValue) {
        super(message);
        this.configKey = configKey;
        this.configValue = configValue;
    }
}
exports.default = InvalidConfigError;

},{}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class if a file is missing. */
class MissingFileError extends Error {
    /**
     * Constructor.
     * @param message Message
     * @param path Path of the file that was missing
     */
    constructor(message, path) {
        super(message);
        this.path = path;
    }
}
exports.default = MissingFileError;

},{}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class for errors that happen while then on demand transpile. */
class OnDemandTranspileError extends Error {
    /**
     * Constructor for on demand transpile errors.
     * @param message Message of the error
     * @param path Path of the issue
     */
    constructor(message, path) {
        super(message);
        this.path = path;
    }
}
exports.default = OnDemandTranspileError;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Error class for unsupported files. */
class UnsupportedFileFormatError extends Error {
    /**
     * Constructor.
     * @param path Path of the unsupported file
     */
    constructor(path) {
        super("This file format is not supported.");
        this.path = path;
    }
}
exports.default = UnsupportedFileFormatError;

},{}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const defaultConfig_1 = require("../config/defaultConfig");
/**
 * Class for easy representation of an import.
 *
 * This class maps the import declarations to simple attributes.
 * Used for comparing them against each other.
 */
class Import {
    /**
     * Constructor for the import.
     * Directly reads out the declaration to make its uses easier.
     * @param importDeclaration declaration from the AST
     * @param sourceFile source file to get the texts from it
     */
    constructor(importDeclaration, sourceFile) {
        /** If the namespace import was used. i.e.: "import * as yourMom". */
        this.isNamespace = false;
        /** If the named imports were used. i.e.: "import {a, b, c}". */
        this.isNamed = false;
        // inspect the source
        let sourceText = importDeclaration.moduleSpecifier.getText(sourceFile);
        sourceText = sourceText.substring(1, sourceText.length - 1);
        let sourceIsRelative = (sourceText.startsWith("./") || sourceText.startsWith("../"));
        this.source = {
            name: sourceText,
            isRelative: sourceIsRelative,
            isPackage: !sourceIsRelative
        };
        // inspect the elements that get imported
        const importClause = importDeclaration.importClause;
        this.isTypeOnly = importClause?.isTypeOnly || false;
        this.elements = [];
        if (!importClause)
            return; // we are done here, no clauses
        if (importClause.name) {
            // if the clause has the name attribute, a default is imported
            const name = importClause.name.getText(sourceFile);
            this.defaultElement = {
                name: name,
                isDefault: true,
                isWildcard: false,
                isRenamed: false,
                isType: !!name.match(/^[A-Z]/),
                isFunctionOrObject: !name.match(/^[A-Z]/)
            };
        }
        if (importClause.namedBindings) {
            // if the clause has namedBindings, non-defaults get imported or the
            // wildcard was used
            const bindings = importClause.namedBindings;
            switch (bindings.kind) {
                case typescript_1.SyntaxKind.NamedImports:
                    this.isNamed = true;
                    // something like: "{a, b as c}"
                    for (let element of bindings.elements) {
                        const name = element.name.getText(sourceFile);
                        let importElement = {
                            name: name,
                            isDefault: false,
                            isWildcard: false,
                            isRenamed: false,
                            isType: !!name.match(/^[A-Z]/),
                            isFunctionOrObject: !name.match(/^[A-Z]/)
                        };
                        if (element.propertyName) {
                            // if the property name is set a rename was used
                            const originalName = element.propertyName.getText(sourceFile);
                            // destructuring for easy override
                            importElement = {
                                ...importElement,
                                ...{
                                    originalName: originalName,
                                    isRenamed: true,
                                    isType: !!originalName.match(/^[A-Z]/),
                                    isFunctionOrObject: !originalName.match(/^[A-Z]/)
                                }
                            };
                        }
                        this.elements.push(importElement);
                    }
                    break;
                case typescript_1.SyntaxKind.NamespaceImport:
                    this.isNamespace = true;
                    // something like: "* as imported"
                    const name = bindings.name.getText(sourceFile);
                    this.elements.push({
                        name: name,
                        isDefault: false,
                        isWildcard: true,
                        isRenamed: true,
                        originalName: "*",
                        isType: !!name.match(/^[A-Z]/),
                        isFunctionOrObject: !name.match(/^[A-Z]/)
                    });
                    break;
            }
        }
    }
    /**
     * Sorts the elements in-place.
     * @param comparator compare function to sort the import elements
     */
    sort(comparator) {
        this.elements.sort(comparator);
        return this;
    }
    /**
     * The basic toString function to format this to a string.
     * If give some formatting options, it will format to the given options.
     * @param formattingOptions options to format the output
     */
    toString(formattingOptions = {
        indent: 2,
        bracketIndent: 0,
        quoteStyle: "double",
        maxColumns: 80
    }) {
        // default values, just to make sure
        const { indent, bracketIndent, quoteStyle, maxColumns } = Object.assign({}, defaultConfig_1.defaultFormatting, formattingOptions);
        const indentString = " ".repeat(indent);
        const bracketIndentString = " ".repeat(bracketIndent);
        const quoteSymbol = quoteStyle === "double" ? '"' : "'";
        let output = "import ";
        if (this.isTypeOnly)
            output += "type ";
        let importElements = [];
        if (this.defaultElement)
            importElements.push(this.defaultElement.name);
        if (this.isNamed) {
            let namedElements = [];
            this.elements.forEach(element => {
                if (element.isRenamed) {
                    namedElements.push(`${element.originalName} as ${element.name}`);
                    return;
                }
                namedElements.push(element.name);
            });
            importElements.push("{" +
                bracketIndentString +
                namedElements.join(", ") +
                bracketIndentString +
                "}");
        }
        if (this.isNamespace) {
            importElements.push(`* as ${this.elements[0].name}`);
        }
        output += importElements.join(", ");
        // no "from" if import only for side effects
        if (this.isNamed || this.isNamespace || this.defaultElement)
            output += " from ";
        output += `${quoteSymbol}${this.source.name}${quoteSymbol};`;
        if (maxColumnsCheck(output, maxColumns)) {
            // try to break on the import elements
            let splitOutput = output.split(/[{}]/);
            if (splitOutput.length === 3) {
                let splitElements = splitOutput[1].split(", ");
                output =
                    splitOutput[0] +
                        "{\n" +
                        indentString +
                        splitElements.join(",\n" + indentString) +
                        "\n}" +
                        splitOutput[2];
            }
        }
        if (maxColumnsCheck(output, maxColumns)) {
            // try to break via reseating the "from"
            let splitOutput = output.split(" from ");
            if (splitOutput.length === 2) {
                output = splitOutput[0] + "\n" + indentString + "from " + splitOutput[1];
            }
        }
        return output;
    }
}
exports.default = Import;
/**
 * Helper function to check if a columns exceeds the maximum column width.
 * @param toCheck the string to check
 * @param maxColumns the max width to check against
 */
function maxColumnsCheck(toCheck, maxColumns) {
    return toCheck.split("\n").some(line => line.length > maxColumns);
}

},{"../config/defaultConfig":8,"typescript":undefined}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typescript_1 = require("typescript");
const IntegrationError_1 = __importDefault(require("../errors/IntegrationError"));
/** Class for integrating imports back into their source file. */
class ImportIntegrator {
    /**
     * Constructor
     * @param formatting Formatting for the imports
     */
    constructor(formatting) {
        this.formatting = formatting;
    }
    /**
     * Runs a toString on every import and concatenates them into one string.
     * @param imports Array of imports
     * @private
     */
    stringifyImports(imports) {
        let output = "";
        for (let imported of imports) {
            if (imported === null)
                output += "\n"; // line separator
            else
                output += imported.toString(this.formatting) + "\n";
        }
        return output.slice(0, -1);
    }
    /**
     * Integrates the imports into the source file's text.
     *
     * <b>Note: Does not actually write the file into the filesystem.</b>
     * @param sourceFile
     * @param imports
     */
    integrate(sourceFile, imports) {
        let importStart = sourceFile.text.search(/^import\s/gm);
        if (importStart === -1)
            return sourceFile.text; // nothing to do
        let importEnd = -1;
        for (let statement of sourceFile.statements) {
            // find the end of the import declarations
            if (statement.kind !== typescript_1.SyntaxKind.ImportDeclaration)
                break;
            importEnd = statement.end;
        }
        if (importEnd === -1) {
            throw new IntegrationError_1.default("Couldn't find the end of imports", sourceFile.text);
        }
        return sourceFile.text.slice(0, importStart) +
            this.stringifyImports(imports) +
            sourceFile.text.slice(importEnd);
    }
}
exports.default = ImportIntegrator;

},{"../errors/IntegrationError":10,"typescript":undefined}],17:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidConfigError_1 = __importDefault(require("../errors/InvalidConfigError"));
const builtinSeparateByFunctions = __importStar(require("../sort_rules/separate_by"));
/** Class to insert the separators into the imports. */
class ImportSeparator {
    constructor(separateByRules, requireFunctions) {
        /**
         * Array of separate by rules.
         * Order is not relevant.
         */
        this.separateByRules = [];
        let separateByFunctions = Object.assign({}, builtinSeparateByFunctions, requireFunctions);
        for (let separateByRule of separateByRules) {
            if (!separateByFunctions[separateByRule]) {
                throw new InvalidConfigError_1.default("Could not find separate by function.", "separateBy", separateByRule);
            }
            this.separateByRules.push(separateByFunctions[separateByRule]);
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
    decideSeparator(a, b) {
        /* istanbul ignore next */
        if (!a || !b)
            return false; // just to make sure, should never happen
        for (let rule of this.separateByRules) {
            // check if one of the rules asks for a separator
            if (rule(a, b))
                return true;
        }
        return false;
    }
    /**
     * Inserts the null elements as separator in an array of imports.
     * @param imports Array of imports to insert the separator
     */
    insertSeparator(imports) {
        let separatedImports = [imports[0]];
        for (let imported of imports.slice(1)) {
            let popped = separatedImports.pop();
            separatedImports.push(popped);
            if (this.decideSeparator(popped, imported)) {
                // the separator is a null value
                separatedImports.push(null);
            }
            separatedImports.push(imported);
        }
        return separatedImports;
    }
}
exports.default = ImportSeparator;

},{"../errors/InvalidConfigError":11,"../sort_rules/separate_by":31}],18:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const InvalidConfigError_1 = __importDefault(require("../errors/InvalidConfigError"));
const builtinImportCompareFunctions = __importStar(require("../sort_rules/compare_imports"));
const builtinImportElementCompareFunctions = __importStar(require("../sort_rules/compare_import_elements"));
/** Class for sorting imports and the import elements. */
class ImportSorter {
    /**
     * Constructor
     * @param sortImports Array of compare function names
     * @param sortImportElements Array of compare function names
     * @param requireFunctions Record of external functions mapped by their names
     */
    constructor(sortImports, sortImportElements, requireFunctions) {
        /**
         * Array of import compare functions.
         * The order of elements is important here.
         */
        this.sortImportOrder = [];
        /**
         * Array of import element compare functions.
         * The order of elements is important here.
         */
        this.sortImportElementOrder = [];
        // merges the builtin compare functions with the external ones
        const importCompareFunctions = Object.assign({}, builtinImportCompareFunctions, requireFunctions);
        // merges the builtin compare functions with the external ones
        const importElementCompareFunctions = Object.assign({}, builtinImportElementCompareFunctions, requireFunctions);
        // tries to order the compare functions by the config
        for (let [sortImport, shouldInverse] of sortImports.map(ImportSorter.shouldInverse)) {
            if (!importCompareFunctions[sortImport]) {
                throw new InvalidConfigError_1.default("Could not find import compare function.", "sortImports", { sortImport, shouldInverse });
            }
            if (shouldInverse) {
                this.sortImportOrder.push(ImportSorter.inverseComparator(importCompareFunctions[sortImport]));
            }
            else {
                this.sortImportOrder.push(importCompareFunctions[sortImport]);
            }
        }
        // tries to order the compare functions by the config
        for (let [sortImportElement, shouldInverse] of sortImportElements.map(ImportSorter.shouldInverse)) {
            if (!importElementCompareFunctions[sortImportElement]) {
                throw new InvalidConfigError_1.default("Could not find import element compare function.", "sortImportElement", { sortImportElement, shouldInverse });
            }
            if (shouldInverse) {
                this.sortImportElementOrder
                    .push(ImportSorter.inverseComparator(importElementCompareFunctions[sortImportElement]));
            }
            else {
                this.sortImportElementOrder
                    .push(importElementCompareFunctions[sortImportElement]);
            }
        }
    }
    /**
     * Helper function to get the rule name and if it should get inverted.
     *
     * A "!" prepending the sort rule indicates inverting it.
     * @param rule The name of a sort rule given from the config
     * @private
     */
    static shouldInverse(rule) {
        return rule.startsWith("!") ? [rule.slice(1), true] : [rule, false];
    }
    /**
     * Function to chain compare functions together.
     * @param sortRules An array of compare functions for the same type
     * @returns A new compare function running through every compare function
     * until it finds a non 0 value
     */
    static chainCompareFunctions(sortRules) {
        return function (a, b) {
            for (let rule of sortRules) {
                let result = rule(a, b);
                if (result !== 0)
                    return result;
            }
            return 0;
        };
    }
    /**
     * Helper function to get the inverse of a comparator function.
     * Since comparator functions simply return numbers, this just returns the
     * negation of them.
     * @returns inverse of a comparator function
     * @param comparator comparator function
     */
    static inverseComparator(comparator) {
        return function (a, b) {
            return -comparator(a, b);
        };
    }
    /**
     * Sorts all imports according to the given sort rules.
     * @param imports Array of imports
     * @returns Array of sorted imports
     */
    sort(imports) {
        const importCompare = ImportSorter.chainCompareFunctions(this.sortImportOrder);
        const importElementCompare = ImportSorter.chainCompareFunctions(this.sortImportElementOrder);
        for (let imported of imports) {
            imported.sort(importElementCompare);
        }
        return imports.sort(importCompare);
    }
}
exports.default = ImportSorter;

},{"../errors/InvalidConfigError":11,"../sort_rules/compare_import_elements":22,"../sort_rules/compare_imports":25}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two import elements based on their names split apart on capital
 * letters.
 * Then this runs the sub words in reverse order to check for likeness.
 * If all sub words are the same but one is longer this will be recognized as
 * equal.
 *
 * <i>This ignores every element that is not a type.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {StartBase, Stuff, OtherBase, PowStuff} from "stuff";
 *
 * // sorted
 * import {StartBase, OtherBase, Stuff, PowStuff} from "stuff";
 * ```
 *
 * @see ImportElement#isFunctionOrObject
 * @param a Import Element A
 * @param b Import Element B
 */
const basenameGroup = function (a, b) {
    if (a.isFunctionOrObject || b.isFunctionOrObject)
        return 0;
    const matcher = /([A-Z][a-z]*)/g;
    const aMatches = a.name.match(matcher);
    const bMatches = b.name.match(matcher);
    const aParts = Array.from(aMatches).reverse();
    const bParts = Array.from(bMatches).reverse();
    const partsLength = Math.min(aParts.length, bParts.length);
    for (let i = 0; i < partsLength; i++) {
        const comparison = aParts[i].localeCompare(bParts[i]);
        if (comparison !== 0)
            return comparison;
    }
    return 0;
};
exports.default = basenameGroup;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two import element names by their name alphabetically.
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {c, d, e, a} from "alphabet";
 *
 * // sorted
 * import {a, b, c, d} from "alphabet";
 * ```
 *
 * @param a Import Element A
 * @param b Import Element B
 */
const elementName = function (a, b) {
    return a.name.localeCompare(b.name);
};
exports.default = elementName;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two import elements whether they are a function, object or Type.
 * If both elements are the same the will recognized as equal.
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {a, B, C, d} from "alphabet";
 *
 * // sorted
 * import {a, d, B, C} from "alphabet";
 * ```
 *
 * @see ImportElement#isFunctionOrObject
 * @see ImportElement#isType
 * @param a Import Element A
 * @param b Import Element B
 */
const elementType = function (a, b) {
    const [aFunction, bFunction] = [a, b].map(m => +m.isFunctionOrObject);
    return bFunction - aFunction;
};
exports.default = elementType;

},{}],22:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementName = exports.elementType = exports.basenameGroup = void 0;
var basenameGroup_1 = require("./basenameGroup");
Object.defineProperty(exports, "basenameGroup", { enumerable: true, get: function () { return __importDefault(basenameGroup_1).default; } });
var elementType_1 = require("./elementType");
Object.defineProperty(exports, "elementType", { enumerable: true, get: function () { return __importDefault(elementType_1).default; } });
var elementName_1 = require("./elementName");
Object.defineProperty(exports, "elementName", { enumerable: true, get: function () { return __importDefault(elementName_1).default; } });

},{"./basenameGroup":19,"./elementName":20,"./elementType":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two imports by their presence of a default import.
 * An import with a default import is considered lesser (positioned higher).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {a, b, c} from "alpha";
 * import d, {e, f} from "beta";
 *
 * // sorted
 * import d, {e, f} from "beta";
 * import {a, b, c} from "alpha";
 * ```
 *
 * @see ImportElement#isDefault
 * @param a Import A
 * @param b Import B
 */
const defaultPresence = function (a, b) {
    const aDefault = a.defaultElement ? 0 : 1;
    const bDefault = b.defaultElement ? 0 : 1;
    return aDefault - bDefault;
};
exports.default = defaultPresence;

},{}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two default imports whether one of them is a type.
 * Element recognized as type imports are considered lesser (higher position).
 *
 * <i>This ignores imports without default imports.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import {gamma} from "Gamma";
 * import alpha from "Alpha";
 * import Beta from "Beta";
 *
 * // sorted
 * import {gamma} from "Gamma";
 * import Beta from "Beta";
 * import alpha from "Alpha";
 * ```
 *
 * @see ImportElement#isType
 * @param a Import A
 * @param b Import B
 */
const defaultType = function (a, b) {
    const aDefault = a.defaultElement;
    const bDefault = b.defaultElement;
    if (!aDefault || !bDefault)
        return 0;
    const aType = aDefault.isType ? 0 : 1;
    const bType = bDefault.isType ? 0 : 1;
    return aType - bType;
};
exports.default = defaultType;

},{}],25:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sourceType = exports.namespacePresence = exports.defaultType = exports.defaultPresence = exports.sourceName = exports.pathName = exports.pathDepth = void 0;
var pathDepth_1 = require("./pathDepth");
Object.defineProperty(exports, "pathDepth", { enumerable: true, get: function () { return __importDefault(pathDepth_1).default; } });
var pathName_1 = require("./pathName");
Object.defineProperty(exports, "pathName", { enumerable: true, get: function () { return __importDefault(pathName_1).default; } });
var sourceName_1 = require("./sourceName");
Object.defineProperty(exports, "sourceName", { enumerable: true, get: function () { return __importDefault(sourceName_1).default; } });
var defaultPresence_1 = require("./defaultPresence");
Object.defineProperty(exports, "defaultPresence", { enumerable: true, get: function () { return __importDefault(defaultPresence_1).default; } });
var defaultType_1 = require("./defaultType");
Object.defineProperty(exports, "defaultType", { enumerable: true, get: function () { return __importDefault(defaultType_1).default; } });
var namespacePresence_1 = require("./namespacePresence");
Object.defineProperty(exports, "namespacePresence", { enumerable: true, get: function () { return __importDefault(namespacePresence_1).default; } });
var sourceType_1 = require("./sourceType");
Object.defineProperty(exports, "sourceType", { enumerable: true, get: function () { return __importDefault(sourceType_1).default; } });

},{"./defaultPresence":23,"./defaultType":24,"./namespacePresence":26,"./pathDepth":27,"./pathName":28,"./sourceName":29,"./sourceType":30}],26:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compare two imports by their presence of a namespace import.
 * An import with a namespace import is considered lesser (positioned higher).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import alpha from "Alpha";
 * import * as beta from "Beta";
 *
 * // sorted
 * import * as beta from "Beta";
 * import alpha from "Alpha";
 * ```
 *
 * @see Import#isNamespace
 * @param a Import A
 * @param b Import B
 */
const namespacePresence = function (a, b) {
    const aNamespace = a.isNamespace ? 0 : 1;
    const bNamespace = b.isNamespace ? 0 : 1;
    return aNamespace - bNamespace;
};
exports.default = namespacePresence;

},{}],27:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two path for their depth.
 * The deeper path is considered greater.
 *
 * <i>This ignores package names.</i>
 *
 * <b>Note: This does not take the path names into account.</b>
 *
 * <b>Example: </b>
 * ```ts
 * // unsorted
 * import a from "./longer/path";
 * import b from "./short-path";
 *
 * // sorted
 * import b from "./short-path";
 * import a from "./longer/path";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const pathDepth = function (a, b) {
    if ([a, b].some(m => m.source.isPackage))
        return 0;
    const [dirsA, dirsB] = [a, b].map(m => m.source.name.split("/").length);
    return dirsA - dirsB;
};
exports.default = pathDepth;

},{}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
/**
 * Compares two source paths by their dir hierarchy from top to bottom.
 * Every element of the tree is compared against the other source and
 * alphabetically ordered.
 *
 * <i>This ignores package names.</i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import c from "./alpha-beta/alpha/c";
 * import b from "./alpha/gamma/b";
 * import a from "./alpha/beta/a";
 *
 * // sorted
 * import a from "./alpha/beta/a";
 * import b from "./alpha/gamma/b";
 * import c from "./alpha-beta/alpha/c";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const pathName = function (a, b) {
    if ([a, b].some(m => m.source.isPackage))
        return 0;
    const [dirsA, dirsB] = [a, b].map(m => (0, path_1.dirname)(m.source.name).split("/"));
    const minLength = Math.min(dirsA.length, dirsB.length);
    for (let i = 0; i < minLength; i++) {
        const comparison = dirsA[i].localeCompare(dirsB[i]);
        if (comparison)
            return comparison;
    }
    return 0;
};
exports.default = pathName;

},{"path":undefined}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two imports based on their source name alphabetically.
 *
 * <i>This ignores relative sources. </i>
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import a from "beta";
 * import b from "alpha";
 *
 * // sorted
 * import b from "alpha";
 * import a from "beta";
 * ```
 *
 * @param a Import A
 * @param b Import B
 */
const sourceName = function (a, b) {
    if ([a, b].some(m => m.source.isRelative))
        return 0;
    return a.source.name.localeCompare(b.source.name);
};
exports.default = sourceName;

},{}],30:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Compares two import sources whether they are relatives or packages.
 * A relative path is considered greater (positioned lower).
 *
 * <b>Example:</b>
 * ```ts
 * // unsorted
 * import b from "./Beta";
 * import c from "Gamma";
 * import a from "Alpha";
 *
 *
 * // sorted
 * import c from "Gamma";
 * import a from "Alpha";
 * import b from "./Beta";
 * ```
 *
 * @see ImportSource#isPackage
 * @see ImportSource#isRelative
 * @param a Import A
 * @param b Import B
 */
const sourceType = function (a, b) {
    const aPackage = a.source.isPackage ? 0 : 1;
    const bPackage = b.source.isPackage ? 0 : 1;
    return aPackage - bPackage;
};
exports.default = sourceType;

},{}],31:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unequalNamespaceUse = exports.unequalPackageState = void 0;
var unequalPackageState_1 = require("./unequalPackageState");
Object.defineProperty(exports, "unequalPackageState", { enumerable: true, get: function () { return __importDefault(unequalPackageState_1).default; } });
var unequalNamespaceUse_1 = require("./unequalNamespaceUse");
Object.defineProperty(exports, "unequalNamespaceUse", { enumerable: true, get: function () { return __importDefault(unequalNamespaceUse_1).default; } });

},{"./unequalNamespaceUse":32,"./unequalPackageState":33}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Place a separator between two imports if one of them is using a namespace
 * import and the other one is not.
 *
 * <b>Example:</b>
 * ```ts
 * // unseparated
 * import everything from "stuff";
 * import everyone from "people";
 * import * as everywhere from "places";
 * import * as everyway from "ways";
 * import everybody from "persons";
 *
 * // separated
 * import everything from "stuff";
 * import everyone from "people";
 *
 * import * as everywhere from "places";
 * import * as everyway from "ways";
 *
 * import everybody from "persons";
 * ```
 * @see Import#isNamespace
 * @param l Leading Import
 * @param f Following Import
 */
const unequalNamespaceUse = function (l, f) {
    return l.isNamespace !== f.isNamespace;
};
exports.default = unequalNamespaceUse;

},{}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Place a separator between two imports if one of them is imported from a
 * package and the other one from a relative path.
 *
 * <b>Example:</b>
 * ```ts
 * // unseparated
 * import a from "alpha";
 * import b from "beta";
 * import c from "./gamma";
 * import d from "./delta";
 * import e from "epsilon";
 *
 * // separated
 * import a from "alpha";
 * import b from "beta";
 *
 * import c from "./gamma";
 * import d from "./delta";
 *
 * import e from "epsilon";
 * ```
 *
 * @see ImportElement#isPackage
 * @see ImportElement#isRelative
 * @param leading Leading Import
 * @param following Following Import
 */
const unequalPackageState = function (leading, following) {
    const leadingIsPackage = leading.source.isPackage;
    const followingIsPackage = following.source.isPackage;
    return leadingIsPackage !== followingIsPackage;
};
exports.default = unequalPackageState;

},{}]},{},[4]);
