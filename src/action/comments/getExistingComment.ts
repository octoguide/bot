import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../../types/data.js";
import type { Entity } from "../../types/entities.js";

import { createCommentIdentifier } from "./createCommentIdentifier.js";

export async function getExistingComment(
	entity: Entity,
	locator: RepositoryLocator,
	octokit: Octokit,
) {
	const target = entity.type === "comment" ? entity.parent : entity.data;

	// TODO: Retrieve all pages, not just the first one
	// https://github.com/JoshuaKGoldberg/OctoGuide/issues/34
	const comments = await octokit.rest.issues.listComments({
		issue_number: target.number,
		owner: locator.owner,
		per_page: 100,
		repo: locator.repository,
	});

	return comments.data.find((comment) =>
		comment.body?.endsWith(createCommentIdentifier(entity)),
	);
}
