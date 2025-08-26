import { findPrTemplate } from "../action/findPrTemplate.js";
import { defineRule } from "./defineRule.js";

export const prBodyDescriptive = defineRule({
	about: {
		config: "recommended",
		description: "PRs should have a description beyond the template.",
		explanation: [
			`This repository expects pull requests to include a description explaining the changes.`,
			`The description should have at least one word not in the PR template, or any content if no template exists.`,
		],
		name: "pr-body-descriptive",
	},
	async pullRequest(context, entity) {
		if (!entity.data.body) {
			context.report({
				primary: "This PR doesn't have a description.",
				suggestion: [
					"Please add a description explaining the purpose and changes in this PR.",
				],
			});
			return;
		}

		const template = await findPrTemplate(context.octokit, context.locator);

		if (!template) {
			if (
				entity.data.body
					.trim()
					.split(/\s+/)
					.filter((word) => word.length > 0).length === 0
			) {
				context.report({
					primary: "This PR's description doesn't contain any words.",
					suggestion: [
						"Please add at least a brief explanation of the changes.",
					],
				});
			}
			return;
		}

		const templateWords = new Set(
			template.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [],
		);

		const bodyWords =
			entity.data.body.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

		const uniqueWords = bodyWords.filter((word) => !templateWords.has(word));

		if (uniqueWords.length === 0) {
			context.report({
				primary:
					"This PR's description doesn't contain any content beyond the template.",
				suggestion: [
					"Please add a description explaining the purpose and changes in this PR.",
				],
			});
		}
	},
});
