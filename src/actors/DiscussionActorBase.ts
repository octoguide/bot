import type { CommentData, DiscussionData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

export interface DiscussionCommentData extends CommentData {
	parent_id?: number;
}

interface CreateCommentResponse {
	addDiscussionComment: {
		comment: {
			body: string;
			url: string;
		};
	};
}

interface GetDiscussionResponse {
	repository: {
		discussion: {
			id: string;
		};
	};
}

export abstract class DiscussionActorBase<
	Data extends CommentData | DiscussionData,
> extends EntityActorBase<Data> {
	async listComments() {
		const iterator = this.octokit.paginate.iterator(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
			{
				discussion_number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		const comments: DiscussionCommentData[] = [];
		for await (const response of iterator) {
			comments.push(...(response.data as DiscussionCommentData[]));
		}

		return comments;
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

	protected async createCommentResponse(body: string, replyToId?: string) {
		const { repository } = await this.octokit.graphql<GetDiscussionResponse>(
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
				mutation($body: String!, $discussionId: ID!, $replyToId: ID) {
					addDiscussionComment(input: {
						discussionId: $discussionId,
						replyToId: $replyToId,
						body: $body
					}) {
						comment {
							body
							url
						}
					}
				}
			`,
			{ body, discussionId, replyToId },
		);

		return commentResponse.addDiscussionComment.comment.url;
	}
}
