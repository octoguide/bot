import type { Entity } from "../types/entities.js";

/**
 * Logins of known AI agents that author entities or comments on GitHub.
 * @remarks GitHub gives these the `"Bot"` user type, so they would otherwise
 * be indistinguishable from other bots.
 */
const aiLogins = new Set([
	"amazon-q-developer[bot]",
	"chatgpt-codex-connector[bot]",
	"claude[bot]",
	"coderabbitai[bot]",
	"Copilot",
	"cursor[bot]",
	"devin-ai-integration[bot]",
	"gemini-code-assist[bot]",
	"google-labs-jules[bot]",
]);

export function isEntityFromAI(entity: Entity) {
	return (
		"user" in entity.data &&
		!!entity.data.user &&
		"type" in entity.data.user &&
		entity.data.user.type === "Bot" &&
		aiLogins.has(entity.data.user.login)
	);
}
