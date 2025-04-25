import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../types/data.js";
import type { IssueEntity } from "../types/entities.js";

export async function resolveIssueEntity(
	locator: RepositoryLocator,
	octokit: Octokit,
	id: number,
): Promise<IssueEntity> {
	const { data } = await octokit.rest.issues.get({
		issue_number: id,
		owner: locator.owner,
		repo: locator.repository,
	});

	return {
		data,
		id,
		type: "issue",
		user: data.user?.login,
	};
}
