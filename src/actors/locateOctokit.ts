import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { LocatedOctokit } from "../types/octokit.js";

/**
 * Defaults an Octokit's `owner` and `repo` API parameters to a repository.
 * @remarks Hooks the provided Octokit in place, rather than creating a new one.
 */
export function locateOctokit(
	octokit: Octokit,
	locator: RepositoryLocator,
): asserts octokit is LocatedOctokit & Octokit {
	octokit.hook.before("request", (options) => {
		if (options.url.endsWith("/graphql")) {
			const variables = (options.variables ??= {}) as Record<string, unknown>;

			variables.owner ??= locator.owner;
			variables.repo ??= locator.repository;
		} else if (options.url.includes("{owner}")) {
			options.owner ??= locator.owner;
			options.repo ??= locator.repository;
		}
	});
}
