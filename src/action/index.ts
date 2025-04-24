import * as github from "@actions/github";

import { runOctoGuideAction } from "./runOctoGuideAction.js";

await runOctoGuideAction(github.context);
