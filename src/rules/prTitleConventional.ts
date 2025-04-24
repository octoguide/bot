// Code inspired by pr-compliance-action:
// https://github.com/mtfoley/pr-compliance-action/blob/bcb6dbea496e44a980f8d6d77af91b67f1eea68d/src/checks.ts

import conventionalTypes from "conventional-commit-types" with { type: "json" };
import { CommitParser } from "conventional-commits-parser";

import type { Rule } from "../types/rules.js";

const commitParser = new CommitParser();

export const prTitleConventional = {
	about: {
		config: "strict",
		description: "PR titles should be in conventional commit format.",
		explanation: [
			`This repository enforces that pull request titles follow the [Conventional Commits](https://www.conventionalcommits.org) format.`,
			`Doing so helps to ensure that the purpose of a pull request is clear and consistent for humans and machines.`,
		],
		name: "pr-conventional-title",
	},
	pullRequest(context, entity) {
		const parsed = commitParser.parse(entity.data.title);
		if (!parsed.type) {
			context.report({
				primary: `The PR title is missing a conventional commit type, such as 'docs: ' or 'feat: ':`,
				secondary: [entity.data.title],
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
					`You'll want to replace the PR type with one of those known types.`,
				],
			});
			return;
		}

		if (!parsed.subject) {
			context.report({
				primary: `PR title is missing a subject after its type.`,
				secondary: [
					`You'll want to add text after the type, like '${parsed.type}: etc. etc.'`,
				],
			});
			return;
		}
	},
} satisfies Rule;
