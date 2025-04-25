import * as github from "@actions/github";

import { runOctoGuideAction } from "./runOctoGuideAction.js";

console.log("env:", process.env);
console.log("process.version:", process.version);
console.log("process.versions:", process.versions);

await runOctoGuideAction(github.context);
