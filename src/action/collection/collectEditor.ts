import type * as github from "@actions/github";

import type { Entity, EntityEditor } from "../../types/entities.js";

/**
 * Finds who edited an entity, if the event is an edit to its body or title by
 * someone other than its author.
 * @remarks Other edits, such as changing a pull request's base branch, don't
 * change any content rules check, so they're still treated as the author's.
 */
export function collectEditor(
	payload: typeof github.context.payload,
	entity: Entity,
): EntityEditor | undefined {
	const changes = payload.changes as
		Partial<Record<string, unknown>> | undefined;

	if (
		payload.action !== "edited" ||
		!payload.sender ||
		!(changes?.body || changes?.title)
	) {
		return undefined;
	}

	const { login, type } = payload.sender as EntityEditor;

	return login === entity.data.user?.login ? undefined : { login, type };
}
