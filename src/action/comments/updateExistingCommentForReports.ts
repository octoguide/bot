import type { EntityActor } from "../../actors/types.js";
import type { CommentData, Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";

import { markdownReporter } from "../../reporters/markdownReporter.js";
import { createCommentBody } from "./createCommentBody.js";

export async function updateExistingCommentForReports(
	actor: EntityActor,
	entity: Entity,
	existingComment: CommentData,
	reports: RuleReport[],
) {
	await actor.updateComment(
		existingComment.id,
		createCommentBody(entity, markdownReporter(entity, reports)),
	);
}
