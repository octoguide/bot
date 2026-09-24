import { octokitFromAuth, type OctokitOptions } from "octokit-from-auth";

import type { RepositoryLocator } from "../types/data.js";
import type { LocatedOctokit } from "../types/octokit.js";

/**
 * Creates an Octokit whose `owner` and `repo` API parameters default to a repository.
 */
export async function createLocatedOctokit(
	locator: RepositoryLocator,
	options?: OctokitOptions,
): Promise<LocatedOctokit> {
	const octokit = await octokitFromAuth(options);

	octokit.hook.before("request", (requestOptions) => {
		if (requestOptions.url.endsWith("/graphql")) {
			const variables = (requestOptions.variables ??= {}) as Record<
				string,
				unknown
			>;

			variables.owner ??= locator.owner;
			variables.repo ??= locator.repository;
		} else if (requestOptions.url.includes("{owner}")) {
			requestOptions.owner ??= locator.owner;
			requestOptions.repo ??= locator.repository;
		}
	});

	return octokit as LocatedOctokit;
}
