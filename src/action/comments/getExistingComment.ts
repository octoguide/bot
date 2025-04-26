import type { EntityActor } from "../../actors/types.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export async function getExistingComment(actor: EntityActor, url: string) {
	const commentIdentifier = createCommentIdentifier(url);
	const comments = await actor.listComments();

	return comments.find((comment) => comment.body?.endsWith(commentIdentifier));
}
