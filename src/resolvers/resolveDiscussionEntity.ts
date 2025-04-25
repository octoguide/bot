import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type {
	CommentData,
	CommentEntity,
	DiscussionData,
	DiscussionEntity,
} from "../types/entities.js";

import { resolveDiscussionComment } from "./resolveDiscussionComment.js";

export async function resolveDiscussionLikeEntity(
	id: string,
	locator: RepositoryLocator,
	octokit: Octokit,
	url: string,
): Promise<CommentEntity | DiscussionEntity | undefined> {
	const commentId = /#discussioncomment-(\d+)/.exec(url)?.[1];

	const response = await octokit.request(
		"GET /repos/{owner}/{repo}/discussions/{discussion_number}",
		{
			discussion_number: +id,
			owner: locator.owner,
			repo: locator.repository,
		},
	);

	// https://github.com/github/rest-api-description/issues/4702
	const discussionData = response.data as DiscussionData;

	if (commentId) {
		const commentData = await resolveDiscussionComment(
			(commentData) => commentData.id === +commentId,
			+id,
			locator,
			octokit,
		);
		if (!commentData) {
			return undefined;
		}

		return {
			commentId: +commentId,
			data: commentData,
			parent: discussionData,
			parentType: "discussion",
			type: "comment",
			user: commentData.user?.login,
		};
	}

	return {
		data: discussionData,
		id: +id,
		type: "discussion",
		user: discussionData.user.login,
	};
}
