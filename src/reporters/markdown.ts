import type { RuleReport } from "../types/rules.js";

import { groupBy } from "../action/groupBy.js";
import { Entity } from "../types/entities.js";
import { formatReport } from "./formatReport.js";

export function markdownReporter(entity: Entity, reports: RuleReport[]) {
	const byRule = groupBy(reports, (report) => report.about.name);

	const printedReports = Object.values(byRule).map((ruleReports) => {
		const { about } = ruleReports[0];
		const url = `https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/${about.name}.md`;

		return [
			`[**${about.name}**](${url})`,
			":",
			ruleReports.length > 1 ? "\n\n" : " ",
			ruleReports.map(formatReport).join("\n\n"),
			"\n",
			about.explanation.join(" "),
		].join("");
	});

	const entityAlias = entity.type.replace("_", " ");
	const entityText =
		entity.type === "comment"
			? `[${entityAlias}](${entity.data.html_url})`
			: entityAlias;

	return [
		"👋 Hi",
		entity.user ? ` @${entity.user}` : "",
		", thanks for the ",
		entityText,
		"! An automatic scan flagged ",
		reports.length > 1 ? "concerns" : "a concern",
		" with it. Could you please take a look?\n\n",
		printedReports.join("\n\n"),
	].join("");
}
