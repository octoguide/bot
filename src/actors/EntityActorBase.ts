import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { CommentData, Entity, EntityData } from "../types/entities.js";
import type { EntityActor } from "./types.js";

export abstract class EntityActorBase<Data extends EntityData>
	implements EntityActor<Data>
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

	abstract createComment(body: string): Promise<string>;
	abstract listComments(): Promise<CommentData[]>;
	abstract updateComment(number: number, newBody: string): Promise<void>;

	// TODO: It would be cleaner & faster to get this from the action event...
	abstract getData(): Promise<Data>;
}
