import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentData, CommentEntity } from "../types/entities.js";

import { DiscussionActorBase } from "./DiscussionActorBase.js";

export class DiscussionCommentActor extends DiscussionActorBase<CommentData> {
	readonly metadata: Omit<CommentEntity, "data">;

	private commentId: number;

	constructor(
		commentId: number,
		discussionNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		super(discussionNumber, locator, octokit);

		this.commentId = commentId;
		this.metadata = {
			commentId,
			parentNumber: discussionNumber,
			parentType: "discussion",
			type: "comment",
		};
	}

	async getData() {
		const comments = await this.listComments();
		const comment = comments.find((comment) => comment.id === this.commentId);

		if (!comment) {
			throw new Error(
				`Could not find comment with id: ${this.commentId.toString()}`,
			);
		}

		return comment;
	}
}
