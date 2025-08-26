import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";

/**
 * Paths where GitHub PR templates might be located according to GitHub documentation.
 * Order matters: the first one found will be used.
 * @see https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository
 */
export const PR_TEMPLATE_PATHS = [
	".github/PULL_REQUEST_TEMPLATE.md",
	".github/pull_request_template.md",
	"docs/PULL_REQUEST_TEMPLATE.md",
	"docs/pull_request_template.md",
];

const PR_TEMPLATE_DIR = ".github/PULL_REQUEST_TEMPLATE";

interface GraphQLEntry {
	name: string;
	path: string;
	type: string;
}

interface GraphQLFileObject {
	text?: string;
}

interface GraphQLRepositoryObject {
	[key: `file${number}`]: GraphQLFileObject | null;
	templateDir?: GraphQLTreeObject | null;
}

interface GraphQLResponse {
	repository: GraphQLRepositoryObject | null;
}

interface GraphQLTreeObject {
	entries?: GraphQLEntry[];
}

export async function findPrTemplate(
	octokit: Octokit,
	locator: RepositoryLocator,
): Promise<string | undefined> {
	const { owner, repository } = locator;

	const fileQueries = PR_TEMPLATE_PATHS.map(
		(path, index) => `
		file${index}: object(expression: "HEAD:${path}") {
			... on Blob {
				text
			}
		}`,
	).join("\n");

	const directoryQuery = `
		templateDir: object(expression: "HEAD:${PR_TEMPLATE_DIR}") {
			... on Tree {
				entries {
					name
					type
					path
				}
			}
		}`;

	const fullQuery = `
		query($owner: String!, $repo: String!) {
			repository(owner: $owner, name: $repo) {
				${fileQueries}
				${directoryQuery}
			}
		}`;

	try {
		const graphqlResponse = await octokit.graphql<GraphQLResponse>(fullQuery, {
			owner,
			repo: repository,
		});

		if (graphqlResponse.repository) {
			for (let i = 0; i < PR_TEMPLATE_PATHS.length; i++) {
				const fileData = graphqlResponse.repository[`file${i}`];
				if (fileData && typeof fileData.text === "string") {
					return fileData.text;
				}
			}

			const templateDirData = graphqlResponse.repository.templateDir;
			if (templateDirData?.entries) {
				const firstMarkdownFile = templateDirData.entries.find(
					(entry) => entry.type === "blob" && entry.name.endsWith(".md"),
				);

				if (firstMarkdownFile?.path) {
					const fileContentQuery = `
						query($owner: String!, $repo: String!, $path: String!) {
							repository(owner: $owner, name: $repo) {
								object(expression: $path) {
									... on Blob {
										text
									}
								}
							}
						}`;

					const fileContentResponse = await octokit.graphql<{
						repository: null | {
							object: null | { text?: string };
						};
					}>(fileContentQuery, {
						owner,
						path: `HEAD:${firstMarkdownFile.path}`,
						repo: repository,
					});

					if (
						fileContentResponse.repository?.object &&
						typeof fileContentResponse.repository.object.text === "string"
					) {
						return fileContentResponse.repository.object.text;
					}
				}
			}
		}
	} catch (error) {
		console.error("Error fetching PR template with GraphQL:", error);
		return undefined;
	}

	return undefined;
}
