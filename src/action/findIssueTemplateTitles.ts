import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";

/**
 * Paths where a single GitHub issue template might be located according to GitHub documentation.
 * @see https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/manually-creating-a-single-issue-template-for-your-repository
 */
export const ISSUE_TEMPLATE_PATHS = [
	".github/ISSUE_TEMPLATE.md",
	".github/issue_template.md",
	"docs/ISSUE_TEMPLATE.md",
	"docs/issue_template.md",
	"ISSUE_TEMPLATE.md",
	"issue_template.md",
];

const ISSUE_TEMPLATE_DIR = ".github/ISSUE_TEMPLATE";

const TEMPLATE_EXTENSIONS = [".md", ".yaml", ".yml"];

interface GraphQLBlobObject {
	text?: string;
}

interface GraphQLEntry {
	name: string;
	object?: GraphQLBlobObject | null;
	type: string;
}

interface GraphQLRepositoryObject {
	[key: `file${number}`]: GraphQLBlobObject | null;
	templateDir?: GraphQLTreeObject | null;
}

interface GraphQLResponse {
	repository: GraphQLRepositoryObject | null;
}

interface GraphQLTreeObject {
	entries?: GraphQLEntry[];
}

/**
 * Collects the default (pre-filled) titles of a repository's issue templates.
 * @returns Each template's `title:`, for templates that specify one.
 */
export async function findIssueTemplateTitles(
	octokit: Octokit,
	locator: RepositoryLocator,
): Promise<string[]> {
	const { owner, repository } = locator;

	const fileQueries = ISSUE_TEMPLATE_PATHS.map(
		(path, index) => `
		file${index}: object(expression: "HEAD:${path}") {
			... on Blob {
				text
			}
		}`,
	).join("\n");

	const fullQuery = `
		query($owner: String!, $repo: String!) {
			repository(owner: $owner, name: $repo) {
				${fileQueries}
				templateDir: object(expression: "HEAD:${ISSUE_TEMPLATE_DIR}") {
					... on Tree {
						entries {
							name
							type
							object {
								... on Blob {
									text
								}
							}
						}
					}
				}
			}
		}`;

	let graphqlResponse: GraphQLResponse;

	try {
		graphqlResponse = await octokit.graphql<GraphQLResponse>(fullQuery, {
			owner,
			repo: repository,
		});
	} catch (error) {
		console.error("Error fetching issue templates with GraphQL:", error);
		return [];
	}

	if (!graphqlResponse.repository) {
		return [];
	}

	const contents: string[] = [];

	for (let i = 0; i < ISSUE_TEMPLATE_PATHS.length; i += 1) {
		const fileData = graphqlResponse.repository[`file${i}`];
		if (typeof fileData?.text === "string") {
			contents.push(fileData.text);
		}
	}

	for (const entry of graphqlResponse.repository.templateDir?.entries ?? []) {
		if (
			entry.type === "blob" &&
			TEMPLATE_EXTENSIONS.some((extension) => entry.name.endsWith(extension)) &&
			typeof entry.object?.text === "string"
		) {
			contents.push(entry.object.text);
		}
	}

	return contents
		.map(parseTemplateTitle)
		.filter((title): title is string => title !== undefined);
}

/**
 * Reads the `title:` a template pre-fills issues with.
 * Markdown templates declare it in front matter; issue forms declare it at the top level.
 * @see https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms
 */
function parseTemplateTitle(contents: string) {
	const frontMatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(contents);
	const title = /^title:(.*)$/m.exec(frontMatter?.[1] ?? contents)?.[1].trim();

	return title ? unquote(title) : undefined;
}

function unquote(text: string) {
	return /^(["'])[\s\S]*\1$/.test(text) ? text.slice(1, -1) : text;
}
