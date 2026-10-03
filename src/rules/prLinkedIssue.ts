import MarkdownIt, { type Token } from "markdown-it";

import type { RepositoryLocator } from "../types/data.js";
import type { PullRequestData } from "../types/entities.js";
import type { LocatedOctokit } from "../types/octokit.js";
import type { RuleContext } from "../types/rules.js";

import { isRequestError } from "../action/comments/isRequestError.js";
import { findPrTemplate } from "../action/findPrTemplate.js";
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

interface ClosingReference {
	inRepository: boolean;
	key: string;
	number: number;
}

const closingReferencePattern =
	/(?<![\w-])(?:close[ds]?|fix(?:e[ds])?|resolve[ds]?)(?:[ \t]*:)?[ \t]+(?:(?:([\w.-]+\/[\w.-]+)|([\w.-]+))?#|gh-|https?:\/\/(?:www\.)?github\.com\/([\w.-]+\/[\w.-]+)\/(?:issues|pull)\/)(\d+)\b/gi;

const issueUrlPattern =
	/^https?:\/\/(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+\/(?:issues|pull)\/\d+\b/i;

const markdown = new MarkdownIt({ html: true });

/**
 * Finds closing keywords on issues in a body, such as `fixes #123`.
 * @remarks Like GitHub, ignores references in code and HTML comments,
 * and references not on the same line as their keyword.
 * @see https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue
 */
function findClosingReferences(locator: RepositoryLocator, body: string) {
	const ownRepository = `${locator.owner}/${locator.repository}`.toLowerCase();
	const references = new Map<string, ClosingReference>();
	const text = getReferenceableText(body);

	for (const match of text.matchAll(closingReferencePattern)) {
		const [, shorthandRepository, shorthandOwner, urlRepository, issueNumber] =
			match;
		const repository = (
			shorthandRepository ||
			(shorthandOwner && `${shorthandOwner}/${locator.repository}`) ||
			urlRepository ||
			ownRepository
		).toLowerCase();
		const number = Number(issueNumber);
		const key = `${repository}#${number}`;

		references.set(key, {
			inRepository: repository === ownRepository,
			key,
			number,
		});
	}

	return Array.from(references.values());
}

/**
 * Gets the text of inline Markdown tokens that may contain references.
 * @remarks Like GitHub, a link counts as a reference by its URL rather than its
 * text, if that URL is to an issue or pull request. Other formatting and inline
 * content such as code are replaced with a line break, since GitHub doesn't
 * treat a keyword as closing when formatting such as emphasis separates it
 * from a reference.
 */
function getInlineText(tokens: Token[]) {
	let inLink = false;
	let text = "";

	for (const token of tokens) {
		if (inLink) {
			inLink = token.type !== "link_close";
			continue;
		}

		switch (token.type) {
			case "link_open": {
				const [url = ""] =
					issueUrlPattern.exec(String(token.attrGet("href"))) ?? [];
				inLink = true;
				text += `${url}\n`;
				break;
			}

			case "text":
				text += token.content;
				break;

			default:
				text += "\n";
		}
	}

	return text;
}

/**
 * Gets the text of a Markdown body that may contain references.
 * @remarks Code and HTML comments are replaced with line breaks, so that text
 * on either side of them can't join together.
 */
function getReferenceableText(body: string) {
	return markdown
		.parse(body, {})
		.map((token) => {
			switch (token.type) {
				case "html_block":
					return token.content.replaceAll(/<!--[\s\S]*?(?:-->|$)/g, "\n");
				case "inline":
					return getInlineText(token.children ?? []);
				default:
					return "";
			}
		})
		.join("\n");
}

/**
 * Checks whether a body uses a closing keyword on an issue, such as `fixes #123`.
 * @remarks GitHub only links issues from closing keywords in pull requests
 * into the default branch, so others (such as stacked PRs) need this instead.
 * References that are also in the PR template, such as an unchanged
 * `fixes #000`, are ignored. References to this repository must be to an
 * existing issue, while references to other repositories are trusted.
 */
async function hasClosingKeyword(context: RuleContext, body: string) {
	const references = findClosingReferences(context.locator, body);
	if (!references.length) {
		return false;
	}

	const template = await findPrTemplate(context.octokit);
	const templateKeys = new Set(
		template
			? findClosingReferences(context.locator, template).map(
					(reference) => reference.key,
				)
			: [],
	);

	for (const reference of references) {
		if (
			!templateKeys.has(reference.key) &&
			(!reference.inRepository ||
				(await issueMightExist(context.octokit, reference.number)))
		) {
			return true;
		}
	}

	return false;
}

/**
 * Checks whether an issue, and not a pull request, might exist.
 * @remarks Only a 404 from GitHub definitively means the issue doesn't exist.
 * Other errors, such as from missing permissions or rate limits, are assumed
 * to be for an existing issue.
 */
async function issueMightExist(octokit: LocatedOctokit, issueNumber: number) {
	try {
		const { data } = await octokit.rest.issues.get({
			issue_number: issueNumber,
		});
		return !data.pull_request;
	} catch (error) {
		return !isRequestError(error) || error.status !== 404;
	}
}

/**
 * Checks whether a pull request targets its repository's default branch.
 * @remarks Pull request data without base branch information, such as partial
 * data passed in by API consumers, is assumed to target the default branch.
 */
function targetsDefaultBranch({ base }: Partial<PullRequestData>) {
	return !base?.repo || base.ref === base.repo.default_branch;
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

		if (
			!targetsDefaultBranch(entity.data) &&
			(await hasClosingKeyword(context, body))
		) {
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
