import type * as github from "@actions/github";

import * as core from "@actions/core";

import { runOctoGuideRules } from "../index.js";
import { cliReporter } from "../reporters/cliReporter.js";
import { collectAuth } from "./collection/collectAuth.js";
import { collectEntityInput } from "./collection/collectEntityInput.js";
import { collectSettings } from "./collection/collectSettings.js";
import { collectTarget } from "./collection/collectTarget.js";
import { outputActionReports } from "./comments/outputActionReports.js";
import { runCommentCleanup } from "./runCommentCleanup.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;
	const { target, url } = collectTarget(payload);
	if (!url) {
		return;
	}

	const auth = collectAuth();

	if (payload.action === "deleted") {
		await runCommentCleanup({ auth, payload, url });
		return;
	}

	const entityInput = collectEntityInput(payload, target, url);
	const settings = collectSettings();

	const { actor, entity, reports } = await runOctoGuideRules({
		auth,
		entityInput,
		settings,
	});

	if (reports.length) {
		core.info(`Found ${reports.length} report(s).`);
		console.log(cliReporter(reports));
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	await outputActionReports(actor, entity, reports, settings);
}
