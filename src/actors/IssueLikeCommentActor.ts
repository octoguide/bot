import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type {
	CommentData,
	CommentEntity,
	IssueLikeEntityType,
} from "../types/entities.js";

import { IssueLikeActorBase } from "./IssueLikeActorBase.js";

export class IssueLikeCommentActor extends IssueLikeActorBase<CommentData> {
	readonly metadata: Omit<CommentEntity, "data">;

	constructor(
		commentId: number,
		locator: RepositoryLocator,
		octokit: Octokit,
		parentNumber: number,
		parentType: IssueLikeEntityType,
	) {
		super(parentNumber, locator, octokit);

		this.metadata = {
			commentId,
			parentNumber,
			parentType,
			type: "comment",
		};
	}

	async getData() {
		const { data } = await this.octokit.rest.issues.getComment({
			comment_id: this.metadata.commentId,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});

		return data;
	}
}
