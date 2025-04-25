import type { Octokit } from "octokit";
import parseGitHubUrl from "parse-github-url";

import type { RepositoryLocator } from "../types/data.js";
import type { Entity } from "../types/entities.js";

import { resolveDiscussionLikeEntity } from "./resolveDiscussionEntity.js";
import { resolveIssueLikeEntity } from "./resolveIssueLikeEntity.js";

export interface ResolvedLintable {
	entity: Entity;
	locator: RepositoryLocator;
}

export async function resolveLintable(
	octokit: Octokit,
	url: string,
): Promise<ResolvedLintable | undefined> {
	const parsed = parseGitHubUrl(url);
	if (!parsed?.owner || !parsed.name) {
		return undefined;
	}

	const matches = /(discussions|issues|pull)\/(\d+)/.exec(url);
	if (!matches) {
		return undefined;
	}

	const [, parentType, id] = matches;

	const locator = {
		owner: parsed.owner,
		repository: parsed.name,
	};

	const entity = await (parentType === "discussions"
		? resolveDiscussionLikeEntity(id, locator, octokit, url)
		: resolveIssueLikeEntity(
				id,
				locator,
				octokit,
				parentType === "issues" ? "issue" : "pull_request",
				url,
			));

	return entity && { entity, locator };
}
