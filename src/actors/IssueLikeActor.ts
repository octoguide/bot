import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type {
	IssueLikeData,
	IssueLikeEntity,
	IssueLikeEntityType,
} from "../types/entities.js";

import { IssueLikeActorBase } from "./IssueLikeActorBase.js";

export class IssueLikeActor extends IssueLikeActorBase<IssueLikeData> {
	readonly metadata: Omit<IssueLikeEntity, "data">;

	constructor(
		entityNumber: number,
		entityType: IssueLikeEntityType,
		locator: RepositoryLocator,
		octokit: Octokit,
	) {
		super(entityNumber, locator, octokit);

		this.metadata = {
			number: entityNumber,
			type: entityType,
		};
	}

	async getData() {
		const { data } = await this.octokit.rest.issues.get({
			issue_number: this.entityNumber,
			owner: this.locator.owner,
			repo: this.locator.repository,
		});

		return data;
	}
}
