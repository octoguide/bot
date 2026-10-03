import type { Entity } from "../types/entities.js";

const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

export function createHeadlineAsMarkdown(
	entity: Entity,
	reports: unknown[],
	logins = entity.data.user ? [entity.data.user.login] : [],
) {
	const entityAlias = entity.type.replace("_", " ");
	const entityText =
		entity.type === "comment"
			? `[${entityAlias}](${entity.data.html_url} "comment ${entity.data.id.toString()} reported by OctoGuide")`
			: entityAlias;

	return [
		"👋 Hi",
		logins.length
			? ` ${listFormat.format(logins.map((login) => `@${login}`))}`
			: "",
		", thanks for the ",
		entityText,
		"! A scan flagged ",
		reports.length > 1 ? "some concerns" : "a concern",
		" with it. Could you please take a look?",
	].join("");
}
