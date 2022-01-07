const fs = require("fs");
const {join} = require("path");

const packagePath = join(__dirname, "../package.json");
let packageContent = fs.readFileSync(packagePath, "utf8");
let packageJson = JSON.parse(packageContent);
packageJson.name = packageJson.name.split("/")[1];
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
