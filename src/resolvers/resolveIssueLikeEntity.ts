import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type {
	CommentEntity,
	IssueLikeEntity,
	IssueLikeEntityType,
} from "../types/entities.js";

import { resolveIssueEntity } from "./resolveIssueEntity.js";
import { resolvePullRequestEntity } from "./resolvePullRequestEntity.js";

export async function resolveIssueLikeEntity(
	id: string,
	locator: RepositoryLocator,
	octokit: Octokit,
	parentType: IssueLikeEntityType,
	url: string,
): Promise<CommentEntity | IssueLikeEntity> {
	const commentId = /#issuecomment-(\d+)/.exec(url)?.[1];

	const { data: issueData } = await octokit.rest.issues.get({
		issue_number: +id,
		owner: locator.owner,
		repo: locator.repository,
	});

	if (commentId) {
		const { data: commentData } = await octokit.rest.issues.getComment({
			comment_id: +commentId,
			owner: locator.owner,
			repo: locator.repository,
		});

		return {
			commentId: +commentId,
			data: commentData,
			parent: issueData,
			parentType,
			type: "comment",
			user: commentData.user?.login,
		};
	}

	return await (issueData.pull_request
		? resolvePullRequestEntity(locator, octokit, +id)
		: resolveIssueEntity(locator, octokit, +id));
}
