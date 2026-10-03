import type * as github from "@actions/github";

import type { Entity, EntityEditor } from "../../types/entities.js";

/**
 * An edit to an entity's body or title by someone other than its author.
 */
export interface EntityEdit {
	/**
	 * User who made the edit.
	 */
	editor: EntityEditor;

	/**
	 * The entity as it was before the edit.
	 */
	previous: Entity;
}

interface EntityChanges {
	body?: { from: string };
	title?: { from: string };
}

/**
 * Finds who edited an entity and what it was before, if the event is an edit
 * to its body or title by someone other than its author.
 * @remarks Other edits, such as changing a pull request's base branch, don't
 * change any content rules check, so they're still treated as the author's.
 */
export function collectEdit(
	payload: typeof github.context.payload,
	entity: Entity,
): EntityEdit | undefined {
	const changes = payload.changes as EntityChanges | undefined;

	if (
		payload.action !== "edited" ||
		!payload.sender ||
		!(changes?.body || changes?.title)
	) {
		return undefined;
	}

	const { login, type } = payload.sender as EntityEditor;
	if (login === entity.data.user?.login) {
		return undefined;
	}

	return {
		editor: { login, type },
		previous: {
			...entity,
			data: {
				...entity.data,
				...(changes.body && { body: changes.body.from }),
				...(changes.title && { title: changes.title.from }),
			},
		} as Entity,
	};
}
