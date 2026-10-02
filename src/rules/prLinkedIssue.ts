import type { PullRequestEntity } from "../types/entities.js";

import { defineRule } from "./defineRule.js";

interface ClosingIssuesResponse {
	repository: {
		pullRequest: {
			closingIssuesReferences: {
				nodes: {
					number: number;
				}[];
			};
		};
	};
}

/**
 * Checks whether a body uses a closing keyword on an issue, such as `fixes #123`.
 * @remarks GitHub only records closing issue references for pull requests
 * into the default branch, so others (such as stacked PRs) need this instead.
 * @see https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
 */
function hasClosingKeyword(body: string) {
	return /\b(?:close[ds]?|fix(?:e[ds])?|resolve[ds]?):?\s+(?:(?:[\w.-]+\/[\w.-]+)?#|https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/)\d+/i.test(
		body,
	);
}

function targetsDefaultBranch(entity: PullRequestEntity) {
	return entity.data.base.ref === entity.data.base.repo.default_branch;
}

export const prLinkedIssue = defineRule({
	about: {
		config: "strict",
		description: "PRs should be linked as closing an issue.",
		explanation: [
			`This repository keeps to GitHub issues for discussing potential changes.`,
			`Most or all changes should be marked as approved in an issue before a pull request is sent to resolve them.`,
		],
		name: "pr-linked-issue",
	},
	async pullRequest(context, entity) {
		const response = await context.octokit.graphql<ClosingIssuesResponse>(
			`
				query closingIssues($id: Int!, $owner: String!, $repo: String!) {
					repository(owner: $owner, name: $repo) {
						pullRequest(number: $id) {
							closingIssuesReferences(first: 1) {
								nodes {
									number
								}
							}
						}
					}
				}
			`,
			{ id: entity.number },
		);

		if (response.repository.pullRequest.closingIssuesReferences.nodes.length) {
			return;
		}

		const body = entity.data.body?.trim() ?? "";
		const dependabotAlertPattern =
			/https:\/\/github\.com\/[^/]+\/[^/]+\/security\/dependabot\/\d+/;
		if (dependabotAlertPattern.test(body)) {
			return;
		}

		if (!targetsDefaultBranch(entity) && hasClosingKeyword(body)) {
			return;
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
			suggestion: [
				"To resolve this report:",
				"* If this is a straightforward documentation change that doesn't need an issue, you can ignore this report",
				"* If there is a backing issue, add a 'fixes #...' link to the pull request body",
				"* If addressing a Dependabot alert, add a link to the alert (e.g., https://github.com/owner/repo/security/dependabot/123)",
				"* Otherwise, file an issue explaining what you'd like to happen",
			],
		});
	},
});
