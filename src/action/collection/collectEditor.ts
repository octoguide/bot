import type * as github from "@actions/github";

import type { Entity } from "../../types/entities.js";

export interface Editor {
	login: string;
	type: string;
}

/**
 * Finds who edited an entity, if the event is an edit by someone other than
 * the entity's author.
 */
export function collectEditor(
	payload: typeof github.context.payload,
	entity: Entity,
): Editor | undefined {
	if (payload.action !== "edited" || !payload.sender) {
		return undefined;
	}

	const { login, type } = payload.sender as Editor;

	return login === entity.data.user?.login ? undefined : { login, type };
}
