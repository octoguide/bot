import * as core from "@actions/core";
import * as github from "@actions/github";

import { runOctoGuide } from "../index.js";
import { getCommentForReports } from "./comments/setCommentForReports.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;

	const target = payload.comment ?? payload.issue ?? payload.pull_request;
	if (!target) {
		throw new Error("Could not determine an entity to run OctoGuide on.");
	}

	if (typeof target.html_url !== "string") {
		throw new Error("Target entity's html_url is not a string.");
	}

	core.debug(`Targeting entity at url: ${target.html_url}`);

	const { entity, locator, octokit, reports } = await runOctoGuide({
		githubToken: core.getInput("github-token"),
		url: target.html_url,
	});

	if (reports.length) {
		core.error(`Found ${reports.length.toString()} report(s).`);
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	const comment = await getCommentForReports(entity, locator, octokit, reports);

	core.debug(
		comment
			? `Reports comment: ${comment.url} (${comment.status})`
			: "No comment created.",
	);
}
