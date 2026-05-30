import { defineRule } from "./defineRule.js";

const AI_LABEL_TARGETS = new Set([
	"ai-slop",
	"ai slop",
	"automation-signal",
	"automation signal",
]);

export const prAiGenerated = defineRule({
	about: {
		config: "recommended",
		description: "PRs labeled as AI-generated or automated should be closed.",
		explanation: [
			'Pull requests labeled as AI-generated (e.g. "ai slop") or automated (e.g. "automation-signal") indicate contributions that were not meaningfully authored by a human.',
			"These contributions are often low-quality, miss project context, and create unnecessary review burden for maintainers.",
		],
		name: "pr-ai-generated",
	},
	pullRequest(context, entity) {
		if (entity.data.state !== "open") {
			return;
		}

		const hasTargetLabel = entity.data.labels.some((label) =>
			AI_LABEL_TARGETS.has(label.name.toLowerCase()),
		);

		if (!hasTargetLabel) {
			return;
		}

		const { owner, repository } = context.locator;
		const contributingUrl = `https://github.com/${owner}/${repository}/blob/HEAD/.github/CONTRIBUTING.md`;

		context.report({
			action: "close",
			primary:
				"This pull request has been labeled as AI-generated or automated and will be closed.",
			secondary: [
				"These types of AI-generated contributions often lack the understanding and context that maintainers need to review and maintain code.",
			],
			suggestion: [
				`Please review the repository's [contributing guidelines](${contributingUrl}) before submitting.`,
			],
		});
	},
});
