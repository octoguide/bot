import type {
	IssueLikeData,
	IssueLikeEntity,
	IssueLikeEntityType,
} from "../types/entities.js";
import type { LocatedOctokit } from "../types/octokit.js";

import { IssueLikeActorBase } from "./IssueLikeActorBase.js";

export class PullRequestActor extends IssueLikeActorBase<IssueLikeData> {
	readonly metadata: Omit<IssueLikeEntity, "data">;

	constructor(
		entityNumber: number,
		entityType: IssueLikeEntityType,
		octokit: LocatedOctokit,
	) {
		super(entityNumber, octokit);

		this.metadata = {
			number: entityNumber,
			type: entityType,
		};
	}

	async getData() {
		const { data } = await this.octokit.rest.pulls.get({
			pull_number: this.entityNumber,
		});

		return data;
	}
}
