import type { Entity } from "../types/entities.js";

import { isEntityFromBot } from "./isEntityFromBot.js";

/**
 * Logins of known AI agents that author or review entities and comments on GitHub.
 * @remarks GitHub gives these the `"Bot"` user type, so they would otherwise
 * be indistinguishable from other bots.
 */
export const aiLogins = new Set([
	"amazon-q-developer[bot]",
	"chatgpt-codex-connector[bot]",
	"claude[bot]",
	"codegen-sh[bot]",
	"coderabbitai[bot]",
	"Copilot",
	"cubic-dev-ai[bot]",
	"cursor[bot]",
	"devin-ai-integration[bot]",
	"ellipsis-dev[bot]",
	"factory-droid[bot]",
	"gemini-code-assist[bot]",
	"google-labs-jules[bot]",
	"kiro-agent[bot]",
	"mentatbot[bot]",
	"sourcery-ai[bot]",
]);

export function isEntityFromAI(entity: Entity) {
	return isEntityFromBot(entity) && aiLogins.has(entity.data.user?.login ?? "");
}
