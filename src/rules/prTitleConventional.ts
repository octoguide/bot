// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };
import { CommitParser } from "conventional-commits-parser";

import { defineRule } from "./defineRule.js";

// Configuring the parser to recognize breaking-change headers that
// include a `!` before the colon (e.g., `fix!: ...` or `fix(scope)!: ...`).
// (see https://github.com/conventional-changelog/conventional-changelog/issues/648)
// This helps the parser populate `parsed.type` correctly in more cases.
const commitParser = new CommitParser({
	// Matches: type, optional (scope), '!' and the subject
	breakingHeaderPattern: /^(\w*)(?:\((.*)\))?!: (.*)$/,
});

/**
 * Whether a title would pass this rule: it parses with a known type and subject.
 */
function isConventionalTitle(title: string) {
	const parsed = commitParser.parse(title);

	return (
		!!parsed.type &&
		Object.hasOwn(conventionalTypes.types, parsed.type) &&
		!!parsed.subject
	);
}

/**
 * Attempts to fix a title that starts with a known type, but doesn't follow it
 * with a colon and space, such as `fix(md) [headingIncrements]: subject`.
 * @returns The title's type header and subject, if the fixed title would pass this rule.
 */
function fixTitleSyntax(title: string) {
	const match = /^(\w+)\b(\s*\([^)]*\))?(!)?(.*)$/.exec(title);
	if (!match) {
		return undefined;
	}

	const [, rawType, rawScope = "", breaking = "", rest] = match;
	const type = rawType.toLowerCase();
	const scope = rawScope.trimStart();
	const leadingColon = /^\s*:/;

	if (
		!Object.hasOwn(conventionalTypes.types, type) ||
		rest.trimStart().startsWith("!")
	) {
		return undefined;
	}

	let subject: string;

	if (leadingColon.test(rest)) {
		subject = rest.replace(leadingColon, "");
	} else if (breaking || (scope && scope === rawScope)) {
		subject = rest.replace(/^\s*(\[[^\]]*\]):(?=\s|$)/, "$1");
	} else {
		return undefined;
	}

	const header = type + scope + breaking;
	subject = subject.trim();

	return isConventionalTitle(`${header}: ${subject || "etc."}`)
		? { header, subject }
		: undefined;
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
			const fixed = fixTitleSyntax(entity.data.title);
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
			context.report({
				primary: `The PR title has an unknown type: '${parsed.type}'.`,
				secondary: [
					`Known types are: ${Object.keys(conventionalTypes.types)
						.sort()
						.map((type) => `'${type}'`)
						.join(", ")}`,
				],
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
