import type { RuleReport } from "../types/rules";

export function formatReport(report: RuleReport) {
	const secondaryLines = formatSecondary(report.data.secondary);

	return [
		report.data.primary,
		"\n",
		secondaryLines.join("\n"),
		/^\w+/.test(secondaryLines[secondaryLines.length - 1]) ? " " : "\n",
		...report.data.suggestion,
	].join("");
}

function formatSecondary(secondary: string[] | undefined) {
	return (secondary ?? [])
		.flatMap((line) => line.split("\n"))
		.map((line) => `  ${line}`);
}
