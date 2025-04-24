import type { Octokit } from "octokit";

import * as core from "@actions/core";

import type { RepositoryLocator } from "../../types/data.js";
import type { Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";

import { createNewCommentForReports } from "./createNewCommentForReports.js";
import { getExistingComment } from "./getExistingComment.js";
import { updateExistingCommentAsPassed } from "./updateExistingCommentAsPassed.js";
import { updateExistingCommentForReports } from "./updateExistingCommentForReports.js";

export interface ReportComment {
	status: "created" | "existing";
	url: string;
}

export async function getCommentForReports(
	entity: Entity,
	locator: RepositoryLocator,
	octokit: Octokit,
	reports: RuleReport[],
): Promise<ReportComment | undefined> {
	const existingComment = await getExistingComment(entity, locator, octokit);

	core.info(
		existingComment
			? `Found existing comment: ${existingComment.url}`
			: "No existing comment found.",
	);

	if (!reports.length) {
		if (existingComment) {
			core.info("Updating existing comment as passed.");
			await updateExistingCommentAsPassed(existingComment, locator, octokit);
		}
		return existingComment && { status: "existing", url: existingComment.url };
	}

	if (existingComment) {
		core.info("Updating existing comment for reports.");
		await updateExistingCommentForReports(
			existingComment,
			locator,
			octokit,
			reports,
		);
		return { status: "existing", url: existingComment.url };
	}

	core.info("Creating existing comment for reports.");
	const newComment = await createNewCommentForReports(
		entity,
		locator,
		octokit,
		reports,
	);
	core.info(`Created new comment: ${newComment.url}`);

	return {
		status: "created",
		url: newComment.url,
	};
}
