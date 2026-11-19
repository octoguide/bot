import type { Entity } from "../../types/entities.ts";
import type { Settings } from "../../types/settings.ts";

import { createCommentIdentifier } from "./createCommentIdentifier.ts";

export function createCommentBody(
	entity: Entity,
	message: string,
	settings: Settings,
): string {
	return [
		settings.comments?.header && `## ${settings.comments.header}`,
		message,
		settings.comments?.footer && `> _${settings.comments.footer}_`,
		createCommentIdentifier(entity.data.html_url),
	]
		.filter(Boolean)
		.join("\n\n");
}
