import type { RuleReport } from "../types/reports.js";

export function formatReportAsMarkdown(
	report: RuleReport,
	explanation?: string[],
) {
	const secondaryLines = (report.data.secondary ?? []).flatMap((line) =>
		line.split("\n"),
	);

	const middle = secondaryLines.length
		? [
				/^\w/.test(secondaryLines[0]) ? " " : "\n\n",
				secondaryLines.join("\n"),
				/^\w/.test(secondaryLines[secondaryLines.length - 1]) ? " " : "\n\n",
			]
		: [" "];

	const suffix = [
		explanation ? `${explanation.join(" ")} ` : "",
		report.data.suggestion.join("\n"),
	];

	return [report.data.primary, ...middle, ...suffix].join("");
}
