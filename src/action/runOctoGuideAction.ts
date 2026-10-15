import type * as github from "@actions/github";

import * as core from "@actions/core";

import { runOctoGuideRules } from "../index.ts";
import { cliReporter } from "../reporters/cliReporter.ts";
import { collectAuth } from "./collection/collectAuth.ts";
import { collectEntityInput } from "./collection/collectEntityInput.ts";
import { collectSettings } from "./collection/collectSettings.ts";
import { collectTarget } from "./collection/collectTarget.ts";
import { outputActionReports } from "./comments/outputActionReports.ts";
import { runCommentCleanup } from "./runCommentCleanup.ts";

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
		entity: entityInput,
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
