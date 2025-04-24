import type { Entity } from "../../types/entities.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export function createCommentBody(entity: Entity, message: string): string {
	return [
		message,
		"---",
		`> 🗺️ _This message posted automatically by [OctoGuide](https://github.com/JoshuaKGoldberg/OctoGuide), a bot that helps explain best practices for repositories on GitHub._`,
		createCommentIdentifier(entity),
	].join("\n\n");
}
