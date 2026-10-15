// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };

import type { RuleOptions } from "../types/rules.ts";

import { commitParser } from "./commitParser.ts";
import { defineRule } from "./defineRule.ts";
import { getFixedConventionalCommitTitle } from "./getFixedConventionalCommitTitle.ts";

const knownTypes = Object.keys(conventionalTypes.types);

// Matches each scope in a list, keeping package names like `@a/b` intact.
const scopeItems = /@[^,/;\\|]+\/[^,/;\\|]+|[^,/;\\|]+/g;

const trailingPunctuation = /[!,.:;?]+$/;

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
		const scopes = getStringsOption(
			context.options,
			"scopes",
			/^[\w$@.\-*/ ]+$/,
			"ASCII letters, digits, spaces, and _$@.-*/ characters",
		);
		const allowedTypes = getStringsOption(
			context.options,
			"types",
			/^\w+$/,
			"ASCII letters, digits, and _ characters",
		);
		const types = allowedTypes ?? knownTypes;
		const typesLabel = allowedTypes ? "allowed" : "known";
		const exampleType = types.includes("feat") ? "feat" : [...types].sort()[0];
		const subjectCase = getEnumOption(context.options, "subject-case", [
			"lower",
		]);
		const subjectPattern = getPatternOption(context.options, "subject-pattern");
		const subjectPatternError = getStringOption(
			context.options,
			"subject-pattern-error",
		);
		const allowTrailingPunctuation = getBooleanOption(
			context.options,
			"subject-trailing-punctuation",
		);

		if (subjectPatternError && !subjectPattern) {
			throw new Error(
				`pr-title-conventional's "subject-pattern-error" option can only be used alongside its "subject-pattern" option.`,
			);
		}

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

			const exampleTypes = getExampleTypes(types);

			context.report({
				primary: `The PR title is missing ${exampleTypes.length === 1 ? "the" : "a"} conventional commit type, such as ${exampleTypes
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

		const titleScopes = parsed.scope
			?.match(scopeItems)
			?.map((item) => item.trim())
			.filter(Boolean);

		if (titleScopes && titleScopes.length > 1) {
			context.report({
				primary: `The PR title has multiple scopes: '${parsed.scope}'.`,
				secondary: [
					`A conventional commit scope is a single noun describing a section of the codebase.`,
				],
				suggestion: [
					`To resolve this report, keep only one scope, like _"${entity.data.title.replace(`(${parsed.scope})`, `(${titleScopes[0]})`)}"_.`,
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
			return;
		}

		const subject = parsed.subject.trim();
		const titlePrefix = entity.data.title.slice(
			0,
			entity.data.title.length - parsed.subject.length,
		);
		const withSubject = (replacement: string) => titlePrefix + replacement;

		if (subjectCase === "lower" && /^\p{Lu}/u.test(subject)) {
			context.report({
				primary: `The PR title's subject starts with an upper-case letter: '${subject}'.`,
				suggestion: [
					`To resolve this report, lower-case the first letter of the subject, like _"${withSubject(lowerCaseFirst(subject))}"_.`,
				],
			});
			return;
		}

		const punctuation = trailingPunctuation.exec(subject)?.[0];
		if (allowTrailingPunctuation === false && punctuation) {
			const trimmed = subject.replace(trailingPunctuation, "");

			context.report({
				primary: `The PR title's subject ends with punctuation: '${punctuation}'.`,
				suggestion: [
					trimmed
						? `To resolve this report, remove the trailing punctuation, like _"${withSubject(trimmed)}"_.`
						: `To resolve this report, remove the trailing punctuation from the subject.`,
				],
			});
			return;
		}

		if (subjectPattern && subjectPattern.exec(subject)?.[0] !== subject) {
			context.report({
				primary: `The PR title's subject doesn't match the pattern this repository requires: '${subject}'.`,
				secondary: [
					subjectPatternError ??
						`Subjects must match the regular expression \`${subjectPattern.source}\`.`,
				],
				suggestion: [
					`To resolve this report, edit the PR title's subject to match that ${subjectPatternError ? "description" : "regular expression"}.`,
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

function getBooleanOption(options: RuleOptions, name: string) {
	const value = options[name];
	if (value === undefined) {
		return undefined;
	}

	if (typeof value !== "boolean") {
		throw new Error(
			`pr-title-conventional's "${name}" option must be a boolean.`,
		);
	}

	return value;
}

function getEnumOption<Value extends string>(
	options: RuleOptions,
	name: string,
	allowed: Value[],
) {
	const value = options[name];
	if (value === undefined) {
		return undefined;
	}

	if (typeof value !== "string" || !allowed.includes(value as Value)) {
		throw new Error(
			`pr-title-conventional's "${name}" option must be one of: ${formatList(allowed)}.`,
		);
	}

	return value as Value;
}

function getExampleTypes(types: string[]) {
	const preferred = ["docs", "feat"].filter((type) => types.includes(type));

	return [...new Set([...preferred, ...[...types].sort()])].slice(0, 2).sort();
}

function getPatternOption(options: RuleOptions, name: string) {
	const value = getStringOption(options, name);
	if (value === undefined) {
		return undefined;
	}

	try {
		return new RegExp(value);
	} catch {
		throw new Error(
			`pr-title-conventional's "${name}" option must be a valid regular expression.`,
		);
	}
}

function getStringOption(options: RuleOptions, name: string) {
	const value = options[name];
	if (value === undefined) {
		return undefined;
	}

	if (typeof value !== "string" || value.trim() !== value || !value) {
		throw new Error(
			`pr-title-conventional's "${name}" option must be a non-empty trimmed string.`,
		);
	}

	return value;
}

function getStringsOption(
	options: RuleOptions,
	name: string,
	pattern: RegExp,
	characters: string,
) {
	const value = options[name];
	if (value === undefined) {
		return undefined;
	}

	if (
		!Array.isArray(value) ||
		!value.length ||
		!value.every(
			(item) =>
				typeof item === "string" && item.trim() === item && pattern.test(item),
		)
	) {
		throw new Error(
			`pr-title-conventional's "${name}" option must be a non-empty array of trimmed strings made of ${characters}.`,
		);
	}

	return [...new Set(value as string[])];
}

function lowerCaseFirst(subject: string) {
	const [first, ...rest] = subject;

	return first.toLowerCase() + rest.join("");
}
