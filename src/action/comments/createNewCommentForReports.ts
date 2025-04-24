import type { Octokit } from "octokit";

import * as core from "@actions/core";

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
	core.info(`Target number for comment creation: ${target.number.toString()}`);

	const response = await octokit.rest.issues.createComment({
		body: createCommentBody(entity, markdownReporter(entity, reports)),
		issue_number: target.number,
		owner: locator.owner,
		repo: locator.repository,
	});

	return response.data;
}
