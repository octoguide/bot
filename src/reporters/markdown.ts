import type { RuleReport } from "../types/rules.js";

import { groupBy } from "../action/groupBy.js";
import { Entity } from "../types/entities.js";
import { formatSecondary } from "./formatSecondary.js";

export function markdownReporter(entity: Entity, reports: RuleReport[]) {
	const byRule = groupBy(reports, (report) => report.about.name);

	const printedReports = Object.values(byRule).map((ruleReports) => {
		const { about } = ruleReports[0];
		const url = `https://github.com/JoshuaKGoldberg/octoguide/blob/main/docs/rules/${about.name}.md`;

		return [
			`[**${about.name}**](${url})`,
			": ",
			about.description,
			"\n\n",
			ruleReports
				.map((report) =>
					[report.data.primary, ...formatSecondary(report.data.secondary)].join(
						"\n",
					),
				)
				.join("\n\n"),
			"\n\n",
			about.explanation.join(" "),
			` Read more on [OctoGuide > ${about.name}](${url}).`,
		].join("");
	});

	const entityAlias = entity.type.replace("_", " ");

	return [
		`👋${entity.user ? ` @${entity.user},` : ""} automated checks found ${reports.length > 1 ? "issues" : "an issue"} with your ${entityAlias}. `,
		`Could you please take a look and edit the ${entityAlias} accordingly? `,
		`Thanks!`,
		"\n\n",
		printedReports.join("\n\n"),
	].join("");
}
