import * as core from "@actions/core";

import type { Entity } from "../types/entities.js";
import type { RuleReport } from "../types/reports.js";

import { groupBy } from "../action/groupBy.js";

export function actionReporter(entity: Entity, reports: RuleReport[]) {
	const byRule = groupBy(reports, (report) => report.about.name);

	const entityAlias = entity.type.replace("_", " ");

	core.summary.addHeading("OctoGuide Report", 1);
	core.summary.addRaw(
		[
			"👋 Hi",
			entity.data.user ? ` @${entity.data.user.login}` : "",
			", thanks for the ",
			entityAlias,
			"! A scan flagged ",
			reports.length > 1 ? "some concerns" : "a concern",
		].join(""),
	);

	for (const ruleReports of Object.values(byRule)) {
		const { about } = ruleReports[0];

		core.summary.addHeading(`<a href="${about.url}">${about.name}</a>`, 2);
		core.summary.addRaw(about.description);
		core.summary.addBreak();
		core.summary.addRaw(about.explanation.join(" "));
		core.summary.addBreak();

		for (const report of ruleReports) {
			core.summary.addRaw(report.data.primary);

			if (report.data.secondary) {
				core.summary.addRaw(report.data.secondary.join(" "));
			}

			core.summary.addRaw(report.data.suggestion.join("\n"));
		}
	}

	core.summary.addSeparator();
	core.summary.addRaw(
		`🗺️ <em>This message was posted automatically by <a href="https://github.com/JoshuaKGoldberg/OctoGuide">OctoGuide</a>: a bot for GitHub repository best practices.</em>`,
	);
}
