import type { Entity } from "../../types/entities.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export function createCommentBody(entity: Entity, message: string): string {
	return [
		message,
		"---",
		`> 🗺️ _This message was posted automatically by [OctoGuide](https://github.com/JoshuaKGoldberg/OctoGuide): a bot for GitHub repository best practices._`,
		createCommentIdentifier(entity),
	].join("\n\n");
}
