// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };

import { commitParser } from "./commitParser.ts";
import { defineRule } from "./defineRule.ts";
import { getFixedConventionalCommitTitle } from "./getFixedConventionalCommitTitle.ts";

/**
 * Common alternate names for known types, keyed by their lowercase form.
 */
const typeAliases = new Map([
	["bug", "fix"],
	["bugfix", "fix"],
	["bugfixes", "fix"],
	["bugs", "fix"],
	["builds", "build"],
	["built", "build"],
	["chores", "chore"],
	["doc", "docs"],
	["documentation", "docs"],
	["feats", "feat"],
	["feature", "feat"],
	["features", "feat"],
	["fixed", "fix"],
	["fixes", "fix"],
	["hotfix", "fix"],
	["hotfixes", "fix"],
	["performance", "perf"],
	["refactored", "refactor"],
	["refactoring", "refactor"],
	["refactors", "refactor"],
	["reverted", "revert"],
	["reverts", "revert"],
	["styled", "style"],
	["styles", "style"],
	["tested", "test"],
	["tests", "test"],
]);

/**
 * Finds the known type an unknown type was likely meant to be, if any.
 */
function findIntendedType(type: string) {
	const lowercase = type.toLowerCase();

	return Object.hasOwn(conventionalTypes.types, lowercase)
		? lowercase
		: typeAliases.get(lowercase);
}

export const prTitleConventional = defineRule({
	about: {
		config: "strict",
		description: "PR titles should be in conventional commit format.",
		explanation: [
			`This repository asks that pull request titles start with a type in the [Conventional Commits](https://www.conventionalcommits.org) format.`,
			`Doing so helps make the purpose of each pull request clear for humans and machines.`,
		],
		name: "pr-title-conventional",
	},
	pullRequest(context, entity) {
		const parsed = commitParser.parse(entity.data.title);
		if (!parsed.type) {
			const fixed = getFixedConventionalCommitTitle(entity.data.title);
			if (fixed && !fixed.subject) {
				context.report({
					primary: `PR title is missing a subject after its type.`,
					suggestion: [
						`To resolve this report, add text after the type, like _"${fixed.header}: etc."_`,
					],
				});
				return;
			}

			if (fixed) {
				context.report({
					primary: `The PR title does not follow the conventional commit syntax of _"type: subject"_ or _"type(scope): subject"_.`,
					suggestion: [
						`To resolve this report, follow conventional commit syntax, like _"${fixed.header}: ${fixed.subject}"_.`,
					],
				});
				return;
			}

			context.report({
				primary: `The PR title is missing a conventional commit type, such as _"docs: "_ or _"feat: "_.`,
				suggestion: [
					parsed.header
						? `To resolve this report, add a conventional commit type in front of the title, like _"feat: ${parsed.header}"_.`
						: `To resolve this report, add a conventional commit type in front of the title.`,
				],
			});
			return;
		}

		if (!Object.hasOwn(conventionalTypes.types, parsed.type)) {
			const secondary = [
				`Known types are: ${Object.keys(conventionalTypes.types)
					.sort()
					.map((type) => `'${type}'`)
					.join(", ")}`,
			];
			const intendedType = findIntendedType(parsed.type);
			if (intendedType && parsed.subject) {
				const scope = parsed.scope ? `(${parsed.scope})` : "";
				const breaking = parsed.notes.some(
					(note) => note.title === "BREAKING CHANGE",
				)
					? "!"
					: "";

				context.report({
					primary: `The PR title has an unknown type: '${parsed.type}'.`,
					secondary,
					suggestion: [
						`To resolve this report, replace the current type with its known equivalent, like _"${intendedType}${scope}${breaking}: ${parsed.subject}"_.`,
					],
				});
				return;
			}

			context.report({
				primary: `The PR title has an unknown type: '${parsed.type}'.`,
				secondary,
				suggestion: [
					parsed.subject
						? `To resolve this report, replace the current type with one of those known types, like _"feat: ${parsed.subject}"_.`
						: `To resolve this report, replace the current type with one of those known types.`,
				],
			});
			return;
		}

		if (!parsed.subject) {
			context.report({
				primary: `PR title is missing a subject after its type.`,
				suggestion: [
					`To resolve this report, add text after the type, like _"${parsed.type}: etc."_`,
				],
			});
			return;
		}
	},
});
