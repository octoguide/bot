import type { DiscussionData, DiscussionEntity } from "../types/entities.js";
import type { LocatedOctokit } from "../types/octokit.js";

import { DiscussionActorBase } from "./DiscussionActorBase.js";
export class DiscussionActor extends DiscussionActorBase<DiscussionData> {
	readonly metadata: Omit<DiscussionEntity, "data">;

	constructor(entityNumber: number, octokit: LocatedOctokit) {
		super(entityNumber, octokit);

		this.metadata = {
			number: entityNumber,
			type: "discussion",
		};
	}

	async createComment(body: string) {
		return await this.createCommentResponse(body);
	}

	async getData() {
		const response = await this.octokit.request(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}",
			{ discussion_number: this.entityNumber },
		);

		// https://github.com/github/rest-api-description/issues/4702
		return response.data as DiscussionData;
	}
}
