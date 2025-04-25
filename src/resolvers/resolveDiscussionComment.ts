import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";

import { CommentData } from "../types/entities";

export type DiscussionCommentMatcher = (commentData: CommentData) => boolean;

export async function resolveDiscussionComment(
	commentMatcher: DiscussionCommentMatcher,
	discussionId: number,
	locator: RepositoryLocator,
	octokit: Octokit,
) {
	// TODO: Retrieve all comments, not just the first page
	// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
	const commentsResponse = await octokit.request(
		"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
		{
			discussion_number: discussionId,
			owner: locator.owner,
			repo: locator.repository,
		},
	);

	return (commentsResponse.data as CommentData[]).find(commentMatcher);
}
