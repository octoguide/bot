import type { EntityActor } from "../../actors/types.ts";
import type { CommentData, Entity } from "../../types/entities.ts";
import type { Settings } from "../../types/settings.ts";

import { createCommentBody } from "./createCommentBody.ts";

export async function updateExistingCommentForReports(
	actor: EntityActor,
	entity: Entity,
	existingComment: CommentData,
	reported: string,
	settings: Settings,
) {
	await actor.updateComment(
		existingComment.id,
		createCommentBody(entity, reported, settings),
	);
}
