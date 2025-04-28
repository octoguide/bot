import * as core from "@actions/core";

import type { Entity } from "../../types/entities.js";

import { EntityActor } from "../../actors/types.js";
import { markdownReportPassMessage } from "../../reporters/markdownReporter.js";
import { createNewCommentForReports } from "./createNewCommentForReports.js";
import { getExistingComment } from "./getExistingComment.js";
import { updateExistingCommentForReports } from "./updateExistingCommentForReports.js";

export interface ReportComment {
	status: "created" | "existing";
	url: string;
}

export async function getCommentForReports(
	actor: EntityActor,
	entity: Entity,
	reported: string,
): Promise<ReportComment | undefined> {
	const existingComment = await getExistingComment(actor, entity.data.html_url);

	core.info(
		existingComment
			? `Found existing comment: ${existingComment.html_url}`
			: "No existing comment found.",
	);

	if (reported === markdownReportPassMessage) {
		if (existingComment) {
			core.info("Updating existing comment as passed.");
			await updateExistingCommentForReports(
				actor,
				entity,
				existingComment,
				reported,
			);
		}
		return (
			existingComment && { status: "existing", url: existingComment.html_url }
		);
	}

	if (existingComment) {
		core.info("Updating existing comment for reports.");
		await updateExistingCommentForReports(
			actor,
			entity,
			existingComment,
			reported,
		);
		return { status: "existing", url: existingComment.html_url };
	}

	core.info("Creating existing comment for reports.");
	const newCommentUrl = await createNewCommentForReports(
		actor,
		entity,
		reported,
	);
	core.info(`Created new comment: ${newCommentUrl}`);

	return {
		status: "created",
		url: newCommentUrl,
	};
}
