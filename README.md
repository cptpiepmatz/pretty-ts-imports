<p align="center">
  <picture>
    <source srcset="media://primp.svg">
    <source srcset="./icon/primp.svg">
    <img width="250" src="https://raw.githubusercontent.com/cptpiepmatz/pretty-ts-imports/main/icon/primp.svg">
  </picture>
</p>
<h1 align="center">primp</h1>
<h3 align="center">pretty-ts-imports</h3>
<p align="center">
  <b>Sort your TS Imports with complex Rules.</b>
</p>

<br>

<p align="center">
  <a href="https://github.com/cptpiepmatz/pretty-ts-imports">
    <img alt="Version" src="https://img.shields.io/github/package-json/v/cptpiepmatz/pretty-ts-imports?style=for-the-badge&color=8683F2"/>
  </a>
  <a href="https://typescriptlang.org" target="_blank">
    <img alt="TypeScript" src="https://img.shields.io/github/package-json/dependency-version/cptpiepmatz/pretty-ts-imports/typescript?color=3178C6&style=for-the-badge"/>
  </a>
  <a href="https://cptpiepmatz.github.io/pretty-ts-imports/modules.html" target="_blank">
    <img alt="TypeDoc" src="https://img.shields.io/github/package-json/dependency-version/cptpiepmatz/pretty-ts-imports/dev/typedoc?color=9600ff&style=for-the-badge"/>
  </a>
  <a href="https://github.com/cptpiepmatz/pretty-ts-imports/blob/main/LICENSE">
    <img alt="LICENSE" src="https://img.shields.io/github/license/cptpiepmatz/pretty-ts-imports?style=for-the-badge">
  </a>
  <a href="https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/spec">
    <img alt="Test" src="https://img.shields.io/github/workflow/status/cptpiepmatz/pretty-ts-imports/test?label=Test&style=for-the-badge">
  </a>
  <a href="https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/spec">
    <img alt="Min Coverage" src="https://img.shields.io/nycrc/cptpiepmatz/pretty-ts-imports?style=for-the-badge">
  </a>
  <a href="https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/spec">
    <img alt="Test" src="https://img.shields.io/github/workflow/status/cptpiepmatz/pretty-ts-imports/coverage?label=Coverage&style=for-the-badge">
  </a>
</p>

**primp** is a tool to sort your typescript imports by a set of complex rules.
Now you can have the imports your way, if you want that.

## Installation
Simply install primp via command line with npm or yarn globally.
```shell
# via npm registry
npm install -g pretty-ts-imports

# via github registry
npm install -g @cptpiepmatz/pretty-ts-imports
```

Or in your project locally.
```shell
# via npm registry
npm install -D pretty-ts-imports

# via github registry
npm install -D @cptpiepmatz/pretty-ts-imports
```

## Usage
```shell
# using the short form
primp <path>

# using the long form
pretty-ts-imports <path>
```

### Arguments
By using argument flags you can further control primp to more specifically fit
your needs.
- `-r, --recursive` run recursively over the given directory
- `-o, --output` output the files to the given path instead of in-place updates
- `-t, --tsconfig` overwrite path to tsconfig
- `-c, --config` overwrite path to config
- `-w, --watch` run primp in watch mode

## Config
You can use a config to customize how primp should handle your files.
Primp will try to automatically find a primp-config in the given path and above
it.
If primp still won't find your config, you can help it out using the `-c` flag.

Primp will recognize following file formats automatically:
- `.json`
- `.json5`
- `.yml`
- `.yaml`

And following file names:
- `primp`
- `pretty-ts-imports`
- `prettytsimports`

Examples of the config files may be found in
[examples](https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/examples).

Explanation of the config may be found in
[primp.json5](https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/examples/configs/primp.json5)
or in
[primp.yml](https://github.com/cptpiepmatz/pretty-ts-imports/tree/main/examples/configs/primp.yml).

## Programmatically Usage
If you want to use elements of this code in your codebase.
Either for handling imports yourself or using the sorter in webpack or anything
like that, you can easily import them from this package.

You can find docs
[here](https://cptpiepmatz.github.io/pretty-ts-imports/modules.html).
