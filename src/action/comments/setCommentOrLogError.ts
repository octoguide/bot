import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types";
import type { Entity } from "../../types/entities";
import type { RuleReport } from "../../types/reports";

import { actionReporter } from "../../reporters/actionReporter";
import { markdownReporter } from "../../reporters/markdownReporter.js";
import { isRequestError } from "./isRequestError.js";
import { getCommentForReports } from "./setCommentForReports.js";

export async function setCommentOrLogError(
	actor: EntityActor,
	entity: Entity,
	reports: RuleReport[],
) {
	const headline = [
		"👋 Hi",
		entity.data.user ? ` @${entity.data.user.login}` : "",
		", thanks for the ",
		entity.type.replace("_", " "),
		"! A scan flagged ",
		reports.length > 1 ? "some concerns" : "a concern",
		" with it. Could you please take a look?",
	].join("");

	const reported = markdownReporter(headline, reports);

	try {
		const comment = await getCommentForReports(actor, entity, reported);

		core.info(
			comment
				? `Reports comment: ${comment.url} (${comment.status})`
				: "No comment created.",
		);
	} catch (error) {
		core.info("Received an error attempting to set a comments.");

		if (isRequestError(error) && error.status === 403) {
			console.info(error.message);
			core.info(
				"This is expected if the action is run for a PR by a fork of a public repository.",
			);
		} else {
			console.error(error);
		}
	}

	actionReporter(headline, reports, core.summary);
	await core.summary.write();
	core.setFailed(headline);
}
