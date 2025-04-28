import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types";
import type { Entity } from "../../types/entities";
import type { RuleReport } from "../../types/reports";

import { actionReporter } from "../../reporters/actionReporter";
import { createHeadline } from "../../reporters/createHeadline";
import { markdownReporter } from "../../reporters/markdownReporter.js";
import { isRequestError } from "./isRequestError.js";
import { getCommentForReports } from "./setCommentForReports.js";

export async function setCommentOrLogError(
	actor: EntityActor,
	entity: Entity,
	reports: RuleReport[],
) {
	const headline = createHeadline(entity, reports);
	const reported = markdownReporter(headline, reports);

	try {
		const comment = await getCommentForReports(actor, entity, reported);

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

	actionReporter(headline, reports, core.summary);
	await core.summary.write();
	core.setFailed(headline);
}
