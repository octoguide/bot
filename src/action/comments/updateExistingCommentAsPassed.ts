import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../../types/data.js";
import type { CommentData } from "../../types/entities.js";

import { createCommentBody } from "./createCommentBody.js";

export async function updateExistingCommentAsPassed(
	existingComment: CommentData,
	locator: RepositoryLocator,
	octokit: Octokit,
) {
	await octokit.rest.issues.updateComment({
		body: createCommentBody("All reports are resolved now. Thanks! ✅"),
		comment_id: existingComment.id,
		owner: locator.repository,
		repo: locator.repository,
	});
}
