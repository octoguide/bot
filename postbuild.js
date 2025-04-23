const prepend = `globalThis.require = __WEBPACK_EXTERNAL_createRequire(import.meta.dirname);`;

import fs from "node:fs/promises";

await fs.writeFile(
	"dist/index.js",
	[prepend, (await fs.readFile("dist/index.js")).toString()].join("\n"),
);
