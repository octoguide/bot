import type { CommentData, DiscussionData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

export interface DiscussionCommentData extends CommentData {
	parent_id?: number;
}

export abstract class DiscussionActorBase<
	Data extends CommentData | DiscussionData,
> extends EntityActorBase<Data> {
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

		return response.data as DiscussionCommentData[];
	}

	async updateComment(number: number, newBody: string) {
		const comments = await this.listComments();

		const nodeId = comments.find((comment) => comment.id === number)?.node_id;
		if (!nodeId) {
			throw new Error(`Comment with ID ${number.toString()} not found`);
		}

		await this.octokit.graphql(
			`
				mutation($body: String!, $commentId: ID!) {
					updateDiscussionComment(input: {
						body: $body,
						commentId: $commentId
					}) {
						comment {
							id
							body
							updatedAt
						}
					}
				}
			`,
			{
				body: newBody,
				commentId: nodeId,
			},
		);
	}
}
