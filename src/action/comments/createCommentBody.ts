import type { Entity } from "../../types/entities.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export function createCommentBody(entity: Entity, message: string): string {
	return [
		message,
		"---",
		`🗺️ This message posted automatically by [OctoGuide](https://github.com/JoshuaKGoldberg/OctoGuide)`,
		"",
		createCommentIdentifier(entity),
	].join("\n\n");
}
