import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types.ts";
import type { Entity } from "../../types/entities.ts";
import type { Settings } from "../../types/settings.ts";

import { createCommentBody } from "./createCommentBody.ts";

export async function createNewCommentForReports(
	actor: EntityActor,
	entity: Entity,
	reported: string,
	settings: Settings,
) {
	const targetNumber =
		entity.type === "comment" ? entity.parentNumber : entity.number;
	core.info(`Target number for comment creation: ${targetNumber.toString()}`);

	return await actor.createComment(
		createCommentBody(entity, reported, settings),
	);
}
