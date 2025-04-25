import type { Entity } from "../../types/entities.js";

export function createCommentIdentifier(entity: Entity) {
	console.log("Creating comment identifier for:", entity);
	return `<!-- OctoGuide response for: ${entity.data.html_url} -->`;
}
