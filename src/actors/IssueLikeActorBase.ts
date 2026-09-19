import type { CommentData, IssueLikeData } from "../types/entities.js";

import { EntityActorBase } from "./EntityActorBase.js";

export abstract class IssueLikeActorBase<
	Data extends CommentData | IssueLikeData,
> extends EntityActorBase<Data> {
	/**
	 * @remarks `state_reason` is intentionally omitted at this time. The closed
	 * entity may still represent planned work. It is being closed because the
	 * contribution itself is not acceptable (e.g. AI-generated) as stated in the
	 * corresponding report comment, not because the underlying task is unplanned
	 * or irrelevant.
	 */
	async closeEntity() {
		await this.octokit.rest.issues.update({
			issue_number: this.entityNumber,
			owner: this.locator.owner,
			repo: this.locator.repository,
			state: "closed",
		});
	}

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
		// https://github.com/OctoGuide/bot/issues/34
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
