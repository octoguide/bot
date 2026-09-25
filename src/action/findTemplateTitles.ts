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

/**
 * Where each kind of entity's templates live.
 * Discussions only support category forms in a directory, not a single root file.
 * @see https://docs.github.com/en/discussions/managing-discussions-for-your-community/creating-discussion-category-forms
 */
export const TEMPLATE_LOCATIONS = {
	discussion: {
		directory: ".github/DISCUSSION_TEMPLATE",
		paths: [],
	},
	issue: {
		directory: ".github/ISSUE_TEMPLATE",
		paths: ISSUE_TEMPLATE_PATHS,
	},
} satisfies Record<string, TemplateLocation>;

export type TemplatedEntityType = keyof typeof TEMPLATE_LOCATIONS;

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

interface TemplateLocation {
	directory: string;
	paths: readonly string[];
}

const TEMPLATE_EXTENSIONS = [".md", ".yaml", ".yml"];

/**
 * Collects the default (pre-filled) titles of a repository's templates.
 * @returns Each template's `title:`, for templates that specify one.
 */
export async function findTemplateTitles(
	octokit: Octokit,
	locator: RepositoryLocator,
	entityType: TemplatedEntityType,
): Promise<string[]> {
	const { owner, repository } = locator;
	const { directory, paths } = TEMPLATE_LOCATIONS[entityType];

	const fileQueries = paths
		.map(
			(path, index) => `
		file${index}: object(expression: "HEAD:${path}") {
			... on Blob {
				text
			}
		}`,
		)
		.join("\n");

	const fullQuery = `
		query($owner: String!, $repo: String!) {
			repository(owner: $owner, name: $repo) {
				${fileQueries}
				templateDir: object(expression: "HEAD:${directory}") {
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
		console.error(
			`Error fetching ${entityType} templates with GraphQL:`,
			error,
		);
		return [];
	}

	if (!graphqlResponse.repository) {
		return [];
	}

	const contents: string[] = [];

	for (let i = 0; i < paths.length; i += 1) {
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
 * Reads the `title:` a template pre-fills entities with.
 * Markdown templates declare it in front matter; forms declare it at the top level.
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
