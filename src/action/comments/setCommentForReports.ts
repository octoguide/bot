import type { Octokit } from "octokit";

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

	if (!reports.length) {
		if (existingComment) {
			await updateExistingCommentAsPassed(existingComment, locator, octokit);
		}
		return existingComment && { status: "existing", url: existingComment.url };
	}

	if (existingComment) {
		await updateExistingCommentForReports(
			existingComment,
			locator,
			octokit,
			reports,
		);
		return { status: "existing", url: existingComment.url };
	}

	const newComment = await createNewCommentForReports(
		entity,
		locator,
		octokit,
		reports,
	);

	return {
		status: "created",
		url: newComment.url,
	};
}
