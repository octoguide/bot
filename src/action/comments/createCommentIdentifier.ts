import type { Entity } from "../../types/entities.js";

export function createCommentIdentifier(entity: Entity) {
	return `<!-- OctoGuide response for: ${entity.data.url} -->`;
}
