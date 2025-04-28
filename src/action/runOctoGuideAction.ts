import type * as github from "@actions/github";

import * as core from "@actions/core";
import { octokitFromAuth } from "octokit-from-auth";

import { runOctoGuideRules } from "../index.js";
import { cliReporter } from "../reporters/cliReporter.js";
import { isKnownConfig } from "../rules/configs.js";
import { EntityData } from "../types/entities.js";
import { getCommentForReports } from "./comments/setCommentForReports.js";
import { runCommentCleanup } from "./runCommentCleanup.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;
	if (!payload.action) {
		core.info("Unknown payload action. Exiting.");
		return;
	}

	core.debug(`Full target payload: ${JSON.stringify(payload, null, 2)}`);

	const target = (payload.comment ??
		payload.discussion ??
		payload.issue ??
		payload.pull_request) as EntityData | undefined;
	if (!target) {
		throw new Error("Could not determine an entity to run OctoGuide on.");
	}

	const url = target.html_url;
	if (typeof url !== "string") {
		throw new Error("Target entity's html_url is not a string.");
	}

	const auth = core.getInput("github-token");
	if (!auth) {
		throw new Error("Please provide a with.github-token to octoguide.");
	}

	core.info(`Targeting ${payload.action} entity at html_url: ${url}`);

	if (payload.action === "deleted") {
		await runCommentCleanup({ auth, payload, url });
		return;
	}

	const config = core.getInput("config") || "recommended";
	if (!isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const { actor, entity, reports } = await runOctoGuideRules({
		auth,
		config,
		entity: url,
	});

	core.debug(`Full entity: ${JSON.stringify(entity, null, 2)}`);

	if (reports.length) {
		core.info(`Found ${reports.length.toString()} report(s).`);
		console.log(cliReporter(reports));
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	const comment = await getCommentForReports(actor, entity, reports);

	core.info(
		comment
			? `Reports comment: ${comment.url} (${comment.status})`
			: "No comment created.",
	);
}
