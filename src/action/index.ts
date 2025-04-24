import * as github from "@actions/github";

import { runOctoGuideAction } from "./runOctoGuideAction.js";

console.log("Running src/action/index");
console.log("env:", process.env);
console.log("context:", github.context);

await runOctoGuideAction(github.context);
