import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types";
import type { Entity } from "../../types/entities";
import type { RuleReport } from "../../types/reports";

import { markdownReporter } from "../../reporters/markdownReporter.js";
import { getCommentForReports } from "./setCommentForReports.js";

export async function setCommentOrLogError(
	actor: EntityActor,
	entity: Entity,
	reports: RuleReport[],
) {
	const reported = markdownReporter(entity, reports);

	try {
		const comment = await getCommentForReports(actor, entity, reported);

		core.info(
			comment
				? `Reports comment: ${comment.url} (${comment.status})`
				: "No comment created.",
		);
	} catch (error) {
		core.info(
			"Received an error attempting to set a comments. Falling back to logging.",
		);

		if (isGitHubError(error) && error.status !== 403) {
			core.info(
				"403 error: expected if the action is run for a PR by a fork of a public repository.",
			);
			console.info(error);
		} else {
			console.error(error);
		}

		core.setFailed(reported);
	}
}

function isGitHubError(error: unknown): error is { status: number } {
	return (
		typeof error === "object" &&
		error !== null &&
		"status" in error &&
		typeof (error as { status: unknown }).status === "number"
	);
}
