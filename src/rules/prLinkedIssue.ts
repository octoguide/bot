import type { LocatedOctokit } from "../types/octokit.js";

import { isRequestError } from "../action/comments/isRequestError.js";
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
 * Checks whether a linked Dependabot alert might exist.
 * @remarks Tokens without access to the alert's repository, and repositories
 * with alerts disabled, receive a 403 from GitHub. Only a 404 definitively
 * means the alert doesn't exist.
 */
async function dependabotAlertMightExist(
	octokit: LocatedOctokit,
	owner: string,
	repo: string,
	alertNumber: number,
) {
	try {
		await octokit.rest.dependabot.getAlert({
			alert_number: alertNumber,
			owner,
			repo,
		});
		return true;
	} catch (error) {
		return !isRequestError(error) || error.status !== 404;
	}
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
		const dependabotAlert =
			/https:\/\/github\.com\/([^/]+)\/([^/]+)\/security\/dependabot\/(\d+)/.exec(
				body,
			);
		if (
			dependabotAlert &&
			(await dependabotAlertMightExist(
				context.octokit,
				dependabotAlert[1],
				dependabotAlert[2],
				Number(dependabotAlert[3]),
			))
		) {
			return;
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
			...(dependabotAlert && {
				secondary: [
					`The linked Dependabot alert, ${dependabotAlert[0]}, could not be found.`,
				],
			}),
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
