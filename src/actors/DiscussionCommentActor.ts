import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentData, CommentEntity } from "../types/entities.js";

import { DiscussionActorBase } from "./DiscussionActorBase.js";

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

export class DiscussionCommentActor extends DiscussionActorBase<CommentData> {
	readonly metadata: Omit<CommentEntity, "data">;

	constructor(
		commentNumber: number,
		discussionNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		super(discussionNumber, locator, octokit);

		this.metadata = {
			commentNumber,
			parentNumber: discussionNumber,
			parentType: "discussion",
			type: "comment",
		};
	}

	async createComment(body: string) {
		const targetComment = await this.getData();

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

		console.log("figuring out replyToId", {
			repository,
			targetComment,
		});

		const commentResponse = await this.octokit.graphql<CreateCommentResponse>(
			`
				mutation($body: String!, $discussionId: ID!, $replyToId: ID!) {
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
			{
				body,
				discussionId,
				replyToId: targetComment.node_id,
			},
		);

		return commentResponse.addDiscussionComment.comment.url;
	}

	async getData() {
		const comments = await this.listComments();
		const comment = comments.find(
			(comment) => comment.id === this.metadata.commentNumber,
		);

		if (!comment) {
			throw new Error(
				`Could not find comment with id: ${this.metadata.commentNumber.toString()}`,
			);
		}

		return comment;
	}
}
