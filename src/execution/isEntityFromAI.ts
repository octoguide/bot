import type { Entity } from "../types/entities.js";

import { isEntityFromBot } from "./isEntityFromBot.js";

/**
 * Logins of known AI agents that author or review entities and comments on GitHub.
 */
export const aiLogins = new Set([
	"amazon-q-developer[bot]",
	"augmentcode[bot]",
	"baz-reviewer[bot]",
	"bito-code-review[bot]",
	"charliecreates[bot]",
	"chatgpt-codex-connector[bot]",
	"claude[bot]",
	"codeant-ai[bot]",
	"codegen-sh[bot]",
	"coderabbitai[bot]",
	"codiumai-pr-agent-free[bot]",
	"continue[bot]",
	"Copilot",
	"corgea[bot]",
	"cto-new[bot]",
	"cubic-dev-ai[bot]",
	"cursor[bot]",
	"devin-ai-integration[bot]",
	"ellipsis-dev[bot]",
	"entelligence-ai-pr-reviews[bot]",
	"factory-droid[bot]",
	"gemini-cli[bot]",
	"gemini-code-assist[bot]",
	"gitauto-ai[bot]",
	"google-labs-jules[bot]",
	"greptile-apps[bot]",
	"kilo-code-bot[bot]",
	"kiro-agent[bot]",
	"korbit-ai[bot]",
	"llamapreview[bot]",
	"macroscopeapp[bot]",
	"mentatbot[bot]",
	"opencode-agent[bot]",
	"openhands-ai[bot]",
	"qodo-code-review[bot]",
	"recurseml[bot]",
	"roomote[bot]",
	"seer-by-sentry[bot]",
	"sourcery-ai[bot]",
	"tembo[bot]",
	"what-the-diff[bot]",
]);

export function isEntityFromAI(entity: Entity) {
	return isEntityFromBot(entity) && aiLogins.has(entity.data.user.login);
}
