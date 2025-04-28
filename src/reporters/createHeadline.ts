import type { Entity } from "../types/entities.js";

export function createHeadline(entity: Entity, reports: unknown[]) {
	const entityAlias = entity.type.replace("_", " ");
	const entityText =
		entity.type === "comment"
			? `[${entityAlias}](${entity.data.html_url} "comment ${entity.data.id.toString()} reported by OctoGuide")`
			: entityAlias;

	return [
		"👋 Hi",
		entity.data.user ? ` @${entity.data.user.login}` : "",
		", thanks for the ",
		entityText,
		"! A scan flagged ",
		reports.length > 1 ? "some concerns" : "a concern",
		" with it. Could you please take a look?\n\n",
	].join("");
}
