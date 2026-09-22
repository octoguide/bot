import { octokitFromAuth } from "octokit-from-auth";

const githubUrlPrefix = "https://github.com/";

/**
 * Expands a shorthand entity locator to a full GitHub entity URL.
 * @param entity Entity locator, such as `owner/repository/issues/19`.
 * @returns The equivalent full GitHub entity URL.
 * @example
 * // "https://github.com/owner/repository/issues/19"
 * await resolveEntityUrl("owner/repository/issues/19");
 * @example
 * // "https://github.com/(logged-in-user)/repository/issues/19"
 * await resolveEntityUrl("repository/issues/19");
 */
export async function resolveEntityUrl(entity: string) {
	if (entity.includes("github.com")) {
		return entity;
	}

	switch (entity.split("/").length) {
		case 3: {
			const octokit = await octokitFromAuth();
			const { data } = await octokit.rest.users.getAuthenticated();

			return `${githubUrlPrefix}${data.login}/${entity}`;
		}

		case 4:
			return `${githubUrlPrefix}${entity}`;

		default:
			return entity;
	}
}
