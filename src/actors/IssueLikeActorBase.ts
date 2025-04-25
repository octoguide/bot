import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { EntityActor } from "./types.js";

import { CommentData, Entity, IssueLikeData } from "../types/entities.js";

export abstract class IssueLikeActorBase<
	Data extends CommentData | IssueLikeData,
> implements EntityActor<Data>
{
	abstract readonly metadata: Omit<Entity, "data">;

	protected entityNumber: number;
	protected locator: RepositoryLocator;
	protected octokit: Octokit;

	constructor(
		entityNumber: number,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		this.entityNumber = entityNumber;
		this.locator = locator;
		this.octokit = octokit;
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
