import type { CommentData, DiscussionData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

interface CreateCommentResponse {
	data: unknown;
}

export abstract class DiscussionActorBase<
	Data extends CommentData | DiscussionData,
> extends EntityActorBase<Data> {
	async createComment(body: string) {
		const response = await this.octokit.graphql<CreateCommentResponse>(
			`
			mutation($body: String!, $discussionId: ID!) {
			  addDiscussionComment(input: {
				discussionId: $discussionId,
				body: $body
			  }) {
				comment {
				  id
				  body
				  author {
					login
				  }
				}
			  }
			}
		  `,
			{
				body,
				discussionId: this.entityNumber,
			},
		);

		console.log("response:", response);
		return response.data as CommentData;
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
