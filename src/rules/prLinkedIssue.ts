import type { Rule } from "../types/rules.js";

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

export const prLinkedIssue = {
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
				query closingIssues($id: Int!, $owner: String!, $repository: String!) {
					repository(owner: $owner, name: $repository) {
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
			{
				id: entity.id,
				owner: context.locator.owner,
				repository: context.locator.repository,
			},
		);

		if (response.repository.pullRequest.closingIssuesReferences.nodes.length) {
			return;
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
		});
	},
} satisfies Rule;
