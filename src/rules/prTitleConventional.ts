// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };
import { CommitParser } from "conventional-commits-parser";

import { defineRule } from "./defineRule.js";

const commitParser = new CommitParser();

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
