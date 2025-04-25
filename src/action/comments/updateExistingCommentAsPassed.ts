import type { EntityActor } from "../../actors/types.js";
import type { CommentData, Entity } from "../../types/entities.js";

import { createCommentBody } from "./createCommentBody.js";

export async function updateExistingCommentAsPassed(
	actor: EntityActor,
	entity: Entity,
	existingComment: CommentData,
) {
	await actor.updateComment(
		existingComment.id,
		createCommentBody(entity, "All reports are resolved now. Thanks! ✅"),
	);
}
