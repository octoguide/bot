import type { CommentData, IssueLikeData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

export abstract class IssueLikeActorBase<
	Data extends CommentData | IssueLikeData,
> extends EntityActorBase<Data> {
	async createComment(body: string) {
		const response = await this.octokit.rest.issues.createComment({
			body,
			issue_number: this.entityNumber,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});

		return response.data.html_url;
	}

	abstract getData(): Promise<Data>;

	async listComments() {
		// TODO: Retrieve all pages, not just the first one
		// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
		const comments = await this.octokit.rest.issues.listComments({
			issue_number: this.entityNumber,
			owner: this.locator.owner,
			per_page: 100,
			repo: this.locator.repository,
		});

		return comments.data;
	}

	async updateComment(number: number, newBody: string) {
		await this.octokit.rest.issues.updateComment({
			body: newBody,
			comment_id: number,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});
	}
}
