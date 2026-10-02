import * as github from "@actions/github";

import { runOctoGuideAction } from "./runOctoGuideAction.ts";

await runOctoGuideAction(github.context);
