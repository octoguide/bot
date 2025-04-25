import * as core from "@actions/core";

import type { EntityActor } from "../../actors/types.js";
import type { Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";

import { markdownReporter } from "../../reporters/markdownReporter.js";
import { createCommentBody } from "./createCommentBody.js";

export async function createNewCommentForReports(
	actor: EntityActor,
	entity: Entity,
	reports: RuleReport[],
) {
	const targetNumber =
		entity.type === "comment" ? entity.parentNumber : entity.number;
	core.info(`Target number for comment creation: ${targetNumber.toString()}`);

	return await actor.createComment(
		createCommentBody(entity, markdownReporter(entity, reports)),
	);
}
