import { defineRule } from "./defineRule.js";

export const prBranchNonDefault = defineRule({
	about: {
		config: "recommended",
		description: "PRs should be sent from a non-default branch.",
		explanation: [
			`Sending a PR from a repository's default branch, commonly \`main\`, means that repository will have a hard time pulling in updates from the upstream repository.`,
			`It's generally recommended to instead create a new branch per pull request.`,
		],
		name: "pr-branch-non-default",
	},
	async pullRequest(context, entity) {
		const { data } = await context.octokit.rest.repos.get({
			owner: context.locator.owner,
			repo: context.locator.repository,
		});

		if (entity.data.head.ref === data.default_branch) {
			context.report({
				primary: "This PR is sent from the head repository's default branch",
				secondary: [
					`Sending a PR from a default branch means the head repository can't easily be updated after the PR is merged.`,
				],
				suggestion: [
					"You'll need to:",
					"1. Create a new branch on your fork",
					"2. Send a new pull request from that branch",
					"3. Close this pull request",
				],
			});
		}
	},
});
