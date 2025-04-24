import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../../types/data.js";
import type { CommentData, Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";

import { markdownReporter } from "../../reporters/markdown.js";
import { createCommentBody } from "./createCommentBody.js";

export async function updateExistingCommentForReports(
	entity: Entity,
	existingComment: CommentData,
	locator: RepositoryLocator,
	octokit: Octokit,
	reports: RuleReport[],
) {
	await octokit.rest.issues.updateComment({
		body: createCommentBody(entity, markdownReporter(entity, reports)),
		comment_id: existingComment.id,
		owner: locator.owner,
		repo: locator.repository,
	});
}
