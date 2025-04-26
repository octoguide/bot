import type { Entity } from "../../types/entities.js";

export function createCommentIdentifier(url: string) {
	return `<!-- OctoGuide response for: ${url} -->`;
}
