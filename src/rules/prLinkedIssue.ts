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
				id: entity.number,
				owner: context.locator.owner,
				repository: context.locator.repository,
			},
		);

		if (response.repository.pullRequest.closingIssuesReferences.nodes.length) {
			return;
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
			suggestion: [
				"To resolve this report:",
				"* If this is a straightforward documentation change that doesn't need an issue, you can ignore this report",
				"* If there is a backing issue, add a 'fixes #...' link to the pull request body",
				"* Otherwise, file an issue explaining what you'd like to happen",
			],
		});
	},
});
