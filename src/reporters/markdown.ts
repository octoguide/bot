import type { RuleReport } from "../types/rules.js";

import { groupBy } from "../action/groupBy.js";
import { Entity } from "../types/entities.js";
import { formatSecondary } from "./formatSecondary.js";

export function markdownReporter(entity: Entity, reports: RuleReport[]) {
	const byRule = groupBy(reports, (report) => report.about.name);

	const printedReports = Object.values(byRule).map((ruleReports) => {
		const { about } = ruleReports[0];
		return [
			`[${about.name}](https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/${about.name}.md)`,
			about.description,
			ruleReports
				.map((report) =>
					[report.data.primary, ...formatSecondary(report.data.secondary)].join(
						"\n",
					),
				)
				.join("\n\n"),
		].join("\n");
	});

	const entityAlias = entity.type.replace("_", " ");

	return [
		`👋${entity.user ? ` @${entity.user},` : ""} we ran a few automated checks on your ${entityAlias}.`,
		`They came up with a few reports.`,
		`Could you please take a look and edit the ${entityAlias} accordingly?`,
		"\n",
		`Thanks!`,
		"\n\n",
		printedReports.join("\n\n"),
	].join("");
}
