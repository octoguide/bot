import cp from "node:child_process";

import { version } from "./package.js";

console.log("pwd:", cp.execSync("pwd").toString().trim());

export const latestCommit = cp
	.execSync(`git rev-list -n 1 ${version}`)
	.toString()
	.trim();
