import * as github from "@actions/github";

import { runOctoGuideAction } from "./runOctoGuideAction.js";

console.log("Running src/action/index");
console.log(process.env);

await runOctoGuideAction(github.context);
