// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };
import { CommitParser } from "conventional-commits-parser";

import type { RuleOptions } from "../types/rules.js";

import { defineRule } from "./defineRule.js";

// Configuring the parser to recognize breaking-change headers that
// include a `!` before the colon (e.g., `fix!: ...` or `fix(scope)!: ...`).
// (see https://github.com/conventional-changelog/conventional-changelog/issues/648)
// This helps the parser populate `parsed.type` correctly in more cases.
const commitParser = new CommitParser({
	// Matches: type, optional (scope), '!' and the subject
	breakingHeaderPattern: /^(\w*)(?:\(([^()]*)\))?!: (.*)$/,
});

const knownTypes = Object.keys(conventionalTypes.types);

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
		const scopes = getStringsOption(context.options, "scopes");
		const allowedTypes = getStringsOption(context.options, "types");
		const types = allowedTypes ?? knownTypes;
		const typesLabel = allowedTypes ? "allowed" : "known";
		const exampleType = types.includes("feat") ? "feat" : [...types].sort()[0];

		const parsed = commitParser.parse(entity.data.title);
		if (!parsed.type) {
			context.report({
				primary: `The PR title is missing a conventional commit type, such as ${getExampleTypes(
					types,
				)
					.map((type) => `_"${type}: "_`)
					.join(" or ")}.`,
				suggestion: [
					parsed.header
						? `To resolve this report, add a conventional commit type in front of the title, like _"${exampleType}: ${parsed.header}"_.`
						: `To resolve this report, add a conventional commit type in front of the title.`,
				],
			});
			return;
		}

		if (!types.includes(parsed.type)) {
			context.report({
				primary: allowedTypes
					? `The PR title has a type that isn't allowed: '${parsed.type}'.`
					: `The PR title has an unknown type: '${parsed.type}'.`,
				secondary: [
					`${allowedTypes ? "Allowed" : "Known"} types are: ${formatList(types)}`,
				],
				suggestion: [
					parsed.subject
						? `To resolve this report, replace the current type with one of those ${typesLabel} types, like _"${exampleType}: ${parsed.subject}"_.`
						: `To resolve this report, replace the current type with one of those ${typesLabel} types.`,
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

		const scope = parsed.scope?.trim();
		if (scopes && scope && !scopes.includes(scope)) {
			context.report({
				primary: `The PR title has a scope that isn't allowed: '${scope}'.`,
				secondary: [`Allowed scopes are: ${formatList(scopes)}`],
				suggestion: [
					`To resolve this report, replace the current scope with one of those allowed scopes, like _"${entity.data.title.replace(
						`(${parsed.scope})`,
						() => `(${[...scopes].sort()[0]})`,
					)}"_, or remove the scope.`,
				],
			});
		}
	},
});

function formatList(values: string[]) {
	return [...values]
		.sort()
		.map((value) => `'${value}'`)
		.join(", ");
}

function getExampleTypes(types: string[]) {
	const preferred = ["docs", "feat"].filter((type) => types.includes(type));

	return [...new Set([...preferred, ...[...types].sort()])].slice(0, 2).sort();
}

function getStringsOption(options: RuleOptions, name: string) {
	const value = options[name];
	if (value === undefined) {
		return undefined;
	}

	if (
		!Array.isArray(value) ||
		!value.length ||
		!value.every((item) => typeof item === "string" && item)
	) {
		throw new Error(
			`pr-title-conventional's "${name}" option must be a non-empty array of non-empty strings.`,
		);
	}

	return value as string[];
}
