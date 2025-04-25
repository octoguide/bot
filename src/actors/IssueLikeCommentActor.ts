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
		commentNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
		parentNumber: number,
		parentType: IssueLikeEntityType,
	) {
		super(parentNumber, locator, octokit);

		this.metadata = {
			commentNumber,
			parentNumber,
			parentType,
			type: "comment",
		};
	}

	async getData() {
		const { data } = await this.octokit.rest.issues.getComment({
			comment_id: this.metadata.commentNumber,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});

		return data;
	}
}
