import { regex } from "arkregex";

import type { RuleReport } from "../types/reports.ts";

export function formatReportAsMarkdown(
	report: RuleReport,
	explanation?: string[],
) {
	const startsWithWordPattern = regex("^\\w");
	const secondaryLines = (report.data.secondary ?? []).flatMap((line) =>
		line.split("\n"),
	);

	const middle = secondaryLines.length
		? [
				startsWithWordPattern.test(secondaryLines[0]) ? " " : "\n\n",
				secondaryLines.join("\n"),
				startsWithWordPattern.test(secondaryLines[secondaryLines.length - 1])
					? " "
					: "\n\n",
			]
		: [" "];

	const suffix = [
		explanation ? `${explanation.join(" ")} ` : "",
		report.data.suggestion.join("\n"),
	];

	return [report.data.primary, ...middle, ...suffix].join("");
}
