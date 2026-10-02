import type { Entity } from "../types/entities.js";

export function createHeadlineAsMarkdown(
	entity: Entity,
	reports: unknown[],
	mention = entity.data.user?.login,
) {
	const entityAlias = entity.type.replace("_", " ");
	const entityText =
		entity.type === "comment"
			? `[${entityAlias}](${entity.data.html_url} "comment ${entity.data.id.toString()} reported by OctoGuide")`
			: entityAlias;

	return [
		"👋 Hi",
		mention ? ` @${mention}` : "",
		", thanks for the ",
		entityText,
		"! A scan flagged ",
		reports.length > 1 ? "some concerns" : "a concern",
		" with it. Could you please take a look?",
	].join("");
}
