import { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type {
	CommentData,
	CommentEntity,
	DiscussionData,
	DiscussionEntity,
} from "../types/entities.js";

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
		// TODO: Paginate for larger discussions:
		// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
		const commentsResponse = await octokit.request(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
			{
				discussion_number: +id,
				owner: locator.owner,
				repo: locator.repository,
			},
		);

		const commentData = (commentsResponse.data as CommentData[]).find(
			(commentData) => commentData.id === +commentId,
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
