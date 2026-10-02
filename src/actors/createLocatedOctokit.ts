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

	const { paginate } = octokit;

	/**
	 * Pagination expands a route's URL before requesting it, so the request
	 * hook never sees its placeholders. They have to be filled in beforehand.
	 */
	function locateParameters(route: unknown, parameters?: object) {
		const url =
			typeof route === "function"
				? (route as typeof octokit.request).endpoint.DEFAULTS.url
				: route;

		return typeof url === "string" && url.includes("{owner}")
			? { owner: locator.owner, repo: locator.repository, ...parameters }
			: parameters;
	}

	octokit.paginate = Object.assign(
		(route: never, parameters?: object, mapFn?: object) =>
			typeof parameters === "function"
				? paginate(route, locateParameters(route) as never, parameters as never)
				: paginate(
						route,
						locateParameters(route, parameters) as never,
						mapFn as never,
					),
		{
			iterator: (route: never, parameters?: object) =>
				paginate.iterator(route, locateParameters(route, parameters) as never),
		},
	) as typeof paginate;

	return octokit as LocatedOctokit;
}
