import { findPrTemplate } from "../action/findPrTemplate.js";
import { defineRule } from "./defineRule.js";

/**
 * A GitHub closing keyword and its trailing whitespace, such as `fixes ` or `Resolves: `.
 */
const closingKeyword = /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?):?[ \t]+/;

/**
 * A GitHub issue, pull request, or discussion URL, such as
 * `https://github.com/owner/repo/issues/123`,
 * including any comment, file, or other path within it.
 */
const referenceUrl =
	/https?:\/\/(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+\/(?:discussions|issues|pull)\/\d+\b(?:[#/?][\w#/?=&%.~+:-]*)?/;

/**
 * A shorthand issue reference, such as `#123`, `owner/repo#123`, or `GH-123`.
 */
const referenceShorthand = /(?:[\w.-]+\/[\w.-]+)?#\d+\b|gh-\d+\b/;

/**
 * Issue, pull request, and discussion references, such as `#123`,
 * `owner/repo#123`, `GH-123`, or `https://github.com/owner/repo/issues/123`,
 * along with any GitHub closing keyword directly before them (e.g. `fixes #123`).
 */
const issueReferences = new RegExp(
	String.raw`(?<![\w.-])(?:${closingKeyword.source})?(?:${referenceUrl.source}|${referenceShorthand.source})`,
	"gi",
);

/**
 * Task list item checkboxes, such as the `[x]` in `- [x] Tests added`.
 */
const taskListMarkers = /^([ \t]*(?:[-*+]|\d+[.)])[ \t]+)\[[ x]\](?!\S)/gim;

export const prBodyDescriptive = defineRule({
	about: {
		config: "recommended",
		description: "PRs should have a description beyond the template.",
		explanation: [
			`This repository expects pull requests to include a description explaining the changes.`,
			`The description should have at least one word not in the PR template, or any word if no template exists.`,
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

		const bodyWords = getWords(
			entity.data.body.replaceAll(issueReferences, " "),
		);
		const template = await findPrTemplate(context.octokit);

		if (!template) {
			if (bodyWords.length === 0) {
				context.report({
					primary: "This PR's description doesn't contain any words.",
					suggestion: [
						"Please add at least a brief explanation of the changes.",
					],
				});
			}
			return;
		}

		const templateWords = new Set(getWords(template));

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

function getWords(text: string) {
	return (
		text
			.replaceAll(taskListMarkers, "$1")
			.toLowerCase()
			.match(/[\p{L}\p{N}]+/gu) ?? []
	);
}
