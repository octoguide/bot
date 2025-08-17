import * as core from "@actions/core";

import type { Entity } from "../../types/entities.js";
import type { Settings } from "../../types/settings.js";

import { EntityActor } from "../../actors/types.js";
import { markdownReportPassMessage } from "../../reporters/markdownReporter.js";
import { createNewCommentForReports } from "./createNewCommentForReports.js";
import { getExistingComment } from "./getExistingComment.js";
import { updateExistingCommentForReports } from "./updateExistingCommentForReports.js";

export interface ReportComment {
	status: "created" | "existing";
	url: string;
}

export async function setCommentForReports(
	actor: EntityActor,
	entity: Entity,
	reported: string,
	settings: Settings,
): Promise<ReportComment | undefined> {
	const existingComment = await getExistingComment(actor, entity.data.html_url);

	core.info(
		existingComment
			? `Found existing comment: ${existingComment.html_url}`
			: "No existing comment found.",
	);

	const isPassing = reported === markdownReportPassMessage;

	if (isPassing) {
		return await handlePassingReport(
			actor,
			entity,
			existingComment,
			reported,
			settings,
		);
	}

	if (existingComment) {
		return await handleFailingReportWithExistingComment(
			actor,
			entity,
			existingComment,
			reported,
			settings,
		);
	}

	return await handleFailingReportWithoutExistingComment(
		actor,
		entity,
		reported,
		settings,
	);
}

async function handleFailingReportWithExistingComment(
	actor: EntityActor,
	entity: Entity,
	existingComment: NonNullable<Awaited<ReturnType<typeof getExistingComment>>>,
	reported: string,
	settings: Settings,
): Promise<ReportComment> {
	core.info("Updating existing comment for reports.");

	await unminimizeCommentIfPreviouslyResolved(actor, existingComment);

	await updateExistingCommentForReports(
		actor,
		entity,
		existingComment,
		reported,
		settings,
	);

	return { status: "existing", url: existingComment.html_url };
}

async function handleFailingReportWithoutExistingComment(
	actor: EntityActor,
	entity: Entity,
	reported: string,
	settings: Settings,
): Promise<ReportComment> {
	core.info("Creating new comment for reports.");
	const newCommentUrl = await createNewCommentForReports(
		actor,
		entity,
		reported,
		settings,
	);
	core.info(`Created new comment: ${newCommentUrl}`);

	return {
		status: "created",
		url: newCommentUrl,
	};
}

async function handlePassingReport(
	actor: EntityActor,
	entity: Entity,
	existingComment: Awaited<ReturnType<typeof getExistingComment>>,
	reported: string,
	settings: Settings,
): Promise<ReportComment | undefined> {
	if (!existingComment) {
		return undefined;
	}

	core.info("Updating existing comment as passed.");
	await updateExistingCommentForReports(
		actor,
		entity,
		existingComment,
		reported,
		settings,
	);

	await minimizeCommentIfPossible(actor, existingComment);

	return { status: "existing", url: existingComment.html_url };
}

function isCommentResolved(commentBody: string): boolean {
	return commentBody.includes("<!-- resolved-by: OctoGuide -->");
}

async function minimizeCommentIfPossible(
	actor: EntityActor,
	comment: Awaited<ReturnType<typeof getExistingComment>>,
): Promise<void> {
	if (!comment?.node_id) {
		return;
	}

	const success = await actor.minimizeComment(comment.node_id);
	if (success) {
		core.debug(`Successfully minimized comment ${comment.node_id}`);
	} else {
		core.warning(`Failed to minimize comment ${comment.node_id}`);
	}
}

async function unminimizeCommentIfPreviouslyResolved(
	actor: EntityActor,
	comment: Awaited<ReturnType<typeof getExistingComment>>,
): Promise<void> {
	const shouldUnminimize =
		comment?.body && isCommentResolved(comment.body) && comment.node_id;

	core.debug(
		`Comment resolution status: ${isCommentResolved(comment?.body ?? "")}`,
	);

	if (shouldUnminimize && comment.node_id) {
		const success = await actor.unminimizeComment(comment.node_id);
		if (!success) {
			core.warning(`Failed to unminimize comment ${comment.node_id}`);
		}
	}
}
