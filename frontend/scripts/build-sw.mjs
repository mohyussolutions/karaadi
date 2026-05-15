import { readFileSync, writeFileSync } from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ts = require("typescript");

const src = readFileSync("src/sw.ts", "utf8");

const { outputText } = ts.transpileModule(src, {
  compilerOptions: {
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.None,
    strict: false,
  },
  fileName: "sw.ts",
});

writeFileSync("public/sw.js", outputText);
console.log("sw.ts compiled to public/sw.js");
