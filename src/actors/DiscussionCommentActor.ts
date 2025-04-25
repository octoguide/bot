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
		const data = await this.getData();
		const threadComment = data.parent_id
			? await this.getCommentWithNumber(data.parent_id)
			: data;

		return await this.createCommentResponse(body, threadComment.node_id);
	}

	async getData() {
		return await this.getCommentWithNumber(this.metadata.commentNumber);
	}

	private async getCommentWithNumber(number: number) {
		const comments = await this.listComments();
		const comment = comments.find((comment) => comment.id === number);

		if (!comment) {
			throw new Error(
				`Could not find comment with number: ${number.toString()}`,
			);
		}

		return comment;
	}
}
