import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentData, CommentEntity } from "../types/entities.js";

import { DiscussionActorBase } from "./DiscussionActorBase.js";

export class DiscussionCommentActor extends DiscussionActorBase<CommentData> {
	readonly metadata: Omit<CommentEntity, "data">;

	constructor(
		commentId: number,
		discussionNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		super(discussionNumber, locator, octokit);

		this.metadata = {
			commentId,
			parentNumber: discussionNumber,
			parentType: "discussion",
			type: "comment",
		};
	}

	async getData() {
		const comments = await this.listComments();
		const comment = comments.find(
			(comment) => comment.id === this.metadata.commentId,
		);

		if (!comment) {
			throw new Error(
				`Could not find comment with id: ${this.metadata.commentId.toString()}`,
			);
		}

		return comment;
	}
}
