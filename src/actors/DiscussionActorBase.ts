import type { CommentData, DiscussionData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

interface CreateCommentResponse {
	addDiscussionComment: {
		comment: {
			body: string;
			html_url: string;
		};
	};
}

interface DiscussionResponse {
	repository: {
		discussion: {
			id: string;
		};
	};
}

export abstract class DiscussionActorBase<
	Data extends CommentData | DiscussionData,
> extends EntityActorBase<Data> {
	async createComment(body: string) {
		const { repository } = await this.octokit.graphql<DiscussionResponse>(
			`
				query($owner: String!, $repo: String!, $number: Int!) {
				repository(owner: $owner, name: $repo) {
						discussion(number: $number) {
						id
						}
					}
				}
			`,
			{
				number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		const discussionId = repository.discussion.id;

		const commentResponse = await this.octokit.graphql<CreateCommentResponse>(
			`
				mutation($body: String!, $discussionId: ID!) {
					addDiscussionComment(input: {
						discussionId: $discussionId,
						body: $body
					}) {
						comment {
							body
							html_url
						}
					}
				}
			`,
			{ body, discussionId },
		);

		return commentResponse.addDiscussionComment.comment.html_url;
	}

	async listComments() {
		// TODO: Retrieve all comments, not just the first page
		// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
		const response = await this.octokit.request(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
			{
				discussion_number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		return response.data as CommentData[];
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async updateComment(id: number, newBody: string) {
		console.log("Blagh, I don't know how to do this:", { id, newBody });
		throw new Error("Not implemented yet.");
	}
}
