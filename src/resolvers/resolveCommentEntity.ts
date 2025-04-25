import { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentEntity, IssueData } from "../types/entities.js";

export async function resolveCommentEntity(
	locator: RepositoryLocator,
	octokit: Octokit,
	issueData: IssueData,
	commentId: number,
): Promise<CommentEntity> {
	const { data } = await octokit.rest.issues.getComment({
		comment_id: commentId,
		owner: locator.owner,
		repo: locator.repository,
	});

	return {
		commentId,
		data,
		parent: issueData,
		parentType: issueData.pull_request ? "pull_request" : "issue",
		type: "comment",
		user: data.user?.login,
	};
}
