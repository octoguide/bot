import type { EntityActor } from "../../actors/types.js";
import type { Entity } from "../../types/entities.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export async function getExistingComment(actor: EntityActor, entity: Entity) {
	const commentIdentifier = createCommentIdentifier(entity);
	const comments = await actor.listComments();

	return comments.find((comment) => comment.body?.endsWith(commentIdentifier));
}
