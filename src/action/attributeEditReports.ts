import { isDeepStrictEqual } from "node:util";

import type { Entity, EntityEditor } from "../types/entities.js";
import type { RuleReport } from "../types/reports.js";
import type { Settings } from "../types/settings.js";

import { isRuleSkippedForEditor } from "../execution/isRuleSkippedForEditor.js";
import { isRuleSkippedForEntity } from "../execution/isRuleSkippedForEntity.js";
import { resolveRules } from "../execution/resolveRules.js";

export interface AttributedReports {
	logins: string[];
	reports: RuleReport[];
}

export interface AttributeEditReportsOptions {
	editor: EntityEditor;
	entity: Entity;
	previousReports: RuleReport[];
	reports: RuleReport[];
	repositoryOwner: string;
	settings: Settings;
}

/**
 * Attributes the reports from an edit by someone other than an entity's author
 * to whoever caused them, keeping only reports from rules that include that person.
 */
export function attributeEditReports({
	editor,
	entity,
	previousReports,
	reports,
	repositoryOwner,
	settings,
}: AttributeEditReportsOptions): AttributedReports {
	const optionsByRule = new Map(
		resolveRules(settings).map(({ options, rule }) => [
			rule.about.name,
			options,
		]),
	);
	const existing = findExistingReports(previousReports, reports);

	const kept = reports.filter((report) => {
		const options = optionsByRule.get(report.about.name);

		return (
			!!options &&
			(existing.has(report)
				? !isRuleSkippedForEntity(entity, options)
				: !isRuleSkippedForEditor(editor, entity, repositoryOwner, options))
		);
	});

	const logins = [
		kept.some((report) => existing.has(report)) && entity.data.user?.login,
		kept.some((report) => !existing.has(report)) && editor.login,
	].filter((login): login is string => !!login);

	return { logins, reports: kept };
}

/**
 * Finds which reports were already reported before an edit.
 */
function findExistingReports(
	previousReports: RuleReport[],
	reports: RuleReport[],
) {
	const existing = new Set<RuleReport>();
	const unmatched = [...previousReports];

	for (const isMatch of [isSameReport, isSameViolation]) {
		for (const report of reports) {
			if (existing.has(report)) {
				continue;
			}

			const index = unmatched.findIndex((previous) =>
				isMatch(previous, report),
			);
			if (index !== -1) {
				existing.add(report);
				unmatched.splice(index, 1);
			}
		}
	}

	return existing;
}

function isSameReport(a: RuleReport, b: RuleReport) {
	return a.about.name === b.about.name && isDeepStrictEqual(a.data, b.data);
}

function isSameViolation(a: RuleReport, b: RuleReport) {
	return a.about.name === b.about.name && a.data.primary === b.data.primary;
}
