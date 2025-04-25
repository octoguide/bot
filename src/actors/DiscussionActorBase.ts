import type { CommentData, DiscussionData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

export abstract class DiscussionActorBase<
	Data extends CommentData | DiscussionData,
> extends EntityActorBase<Data> {
	async createComment(body: string) {
		const response = await this.octokit.rest.issues.createComment({
			body,
			issue_number: this.entityNumber,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});

		return response.data;
	}

	async listComments() {
		// TODO: Retrieve all comments, not just the first page
		// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
		const commentsResponse = await this.octokit.request(
			"GET /repos/{owner}/{repo}/discussions/{discussion_number}/comments",
			{
				discussion_number: this.entityNumber,
				owner: this.locator.owner,
				repo: this.locator.repository,
			},
		);

		return commentsResponse.data as CommentData[];
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	async updateComment(id: number, newBody: string) {
		console.log("Blagh, I don't know how to do this:", { id, newBody });
		throw new Error("Not implemented yet.");
	}
}
