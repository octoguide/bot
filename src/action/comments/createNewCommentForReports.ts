import type { Octokit } from "octokit";

import type { RepositoryLocator } from "../../types/data.js";
import type { Entity } from "../../types/entities.js";
import type { RuleReport } from "../../types/rules.js";

import { markdownReporter } from "../../reporters/markdown.js";
import { createCommentBody } from "./createCommentBody.js";

export async function createNewCommentForReports(
	entity: Entity,
	locator: RepositoryLocator,
	octokit: Octokit,
	reports: RuleReport[],
) {
	const target = entity.type === "comment" ? entity.parent : entity.data;

	const response = await octokit.rest.issues.createComment({
		body: createCommentBody(markdownReporter(reports)),
		issue_number: target.number,
		owner: locator.repository,
		repo: locator.repository,
	});

	return response.data;
}
