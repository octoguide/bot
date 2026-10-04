import type { RuleContext } from "../types/rules.js";

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

interface DependabotAlertLink {
	alertNumber: number;
	owner: string;
	repo: string;
	url: string;
}

async function dependabotAlertMightExist(
	context: RuleContext,
	{ alertNumber, owner, repo }: DependabotAlertLink,
) {
	try {
		await context.octokit.rest.dependabot.getAlert({
			alert_number: alertNumber,
			owner,
			repo,
		});
		return true;
	} catch (error) {
		if (!isRequestError(error) || error.status !== 404) {
			return true;
		}

		return (
			!/no alert found/i.test(error.message) &&
			`${owner}/${repo}`.toLowerCase() !==
				`${context.locator.owner}/${context.locator.repository}`.toLowerCase()
		);
	}
}

function findDependabotAlertLinks(body: string) {
	const links = new Map<string, DependabotAlertLink>();

	for (const [url, owner, repo, alertNumber] of body.matchAll(
		/https:\/\/github\.com\/([\w.-]+)\/([\w.-]+)\/security\/dependabot\/(\d+)/g,
	)) {
		links.set(url.toLowerCase(), {
			alertNumber: Number(alertNumber),
			owner,
			repo,
			url,
		});
	}

	return Array.from(links.values());
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
		const dependabotAlertLinks = findDependabotAlertLinks(body);

		for (const link of dependabotAlertLinks) {
			if (await dependabotAlertMightExist(context, link)) {
				return;
			}
		}

		context.report({
			primary: "This pull request is not linked as closing any issues.",
			...(dependabotAlertLinks.length > 0 && {
				secondary: dependabotAlertLinks.map(
					(link) =>
						`The linked Dependabot alert, ${link.url}, could not be found.`,
				),
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
