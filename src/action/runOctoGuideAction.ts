import type * as github from "@actions/github";

import * as core from "@actions/core";

import { runOctoGuide } from "../index.js";
import { cliReporter } from "../reporters/cliReporter.js";
import { isKnownConfig } from "../rules/configs.js";
import { getCommentForReports } from "./comments/setCommentForReports.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;

	console.log("payload:", payload);
	const target =
		payload.discussion ??
		payload.comment ??
		payload.issue ??
		payload.pull_request;
	if (!target) {
		throw new Error("Could not determine an entity to run OctoGuide on.");
	}

	if (typeof target.html_url !== "string") {
		throw new Error("Target entity's html_url is not a string.");
	}

	core.info(`Targeting entity at html_url: ${target.html_url}`);

	const config = core.getInput("config") || "recommended";
	if (!isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const { entity, locator, octokit, reports } = await runOctoGuide({
		config,
		githubToken: core.getInput("github-token"),
		url: target.html_url,
	});

	if (reports.length) {
		core.info(`Found ${reports.length.toString()} report(s).`);
		console.log(cliReporter(reports));
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	const comment = await getCommentForReports(entity, locator, octokit, reports);

	core.info(
		comment
			? `Reports comment: ${comment.url} (${comment.status})`
			: "No comment created.",
	);
}
