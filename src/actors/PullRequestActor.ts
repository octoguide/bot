import type {
	IssueLikeData,
	IssueLikeEntity,
	IssueLikeEntityType,
} from "../types/entities.ts";
import type { LocatedOctokit } from "../types/octokit.ts";

import { IssueLikeActorBase } from "./IssueLikeActorBase.ts";

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
