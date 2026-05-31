import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types.js";
import type { Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/reports.js";
import type { Settings } from "../../types/settings.js";

import { actionReporter } from "../../reporters/actionReporter.js";
import { createHeadlineAsMarkdown } from "../../reporters/createHeadlineAsMarkdown.js";
import { markdownReporter } from "../../reporters/markdownReporter.js";
import { isRequestError } from "./isRequestError.js";
import { setCommentForReports } from "./setCommentForReports.js";

export async function outputActionReports(
	actor: EntityActor,
	entity: Entity,
	reports: RuleReport[],
	settings: Settings,
) {
	const headline = createHeadlineAsMarkdown(entity, reports);
	const reported = markdownReporter(headline, reports);

	let commentStepSucceeded = false;

	try {
		const comment = await setCommentForReports(
			actor,
			entity,
			reported,
			settings,
		);

		commentStepSucceeded = true;
		core.info(
			comment
				? `Reports comment: ${comment.url} (${comment.status})`
				: "No comment created.",
		);
	} catch (error) {
		core.info("Received an error attempting to set comments.");

		if (isRequestError(error) && error.status === 403) {
			console.info(`[${error.status}] ${error.message}`);
			core.info(
				"This is expected if the action is run for a PR by a fork of a public repository.",
			);
			core.debug(`Full error stack: ${error.stack}`);
		} else {
			console.error(error);
		}
	}

	if (reports.length) {
		await actionReporter(headline, reports, core.summary);
		await core.summary.write();
		core.setFailed(headline);
	}

	if (
		commentStepSucceeded &&
		reports.some((report) => report.data.action === "close")
	) {
		try {
			await actor.closeEntity();
		} catch (error) {
			core.setFailed(
				`Failed to close entity: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
}
