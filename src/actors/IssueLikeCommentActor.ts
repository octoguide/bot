import type {
	CommentData,
	CommentEntity,
	IssueLikeEntityType,
} from "../types/entities.js";
import type { LocatedOctokit } from "../types/octokit.js";

import { IssueLikeActorBase } from "./IssueLikeActorBase.js";

export class IssueLikeCommentActor extends IssueLikeActorBase<CommentData> {
	readonly metadata: Omit<CommentEntity, "data">;

	constructor(
		commentId: number,
		octokit: LocatedOctokit,
		parentNumber: number,
		parentType: IssueLikeEntityType,
	) {
		super(parentNumber, octokit);

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
		});

		return data;
	}
}
