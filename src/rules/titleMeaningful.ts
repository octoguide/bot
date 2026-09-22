import { areDocsInformative } from "are-docs-informative";

import type { TemplatedEntityType } from "../action/findTemplateTitles.js";
import type {
	DiscussionEntity,
	IssueEntity,
	PullRequestEntity,
} from "../types/entities.js";
import type { RuleContext } from "../types/rules.js";

import { findTemplateTitles } from "../action/findTemplateTitles.js";
import { defineRule } from "./defineRule.js";

/**
 * How many characters a title and a template's title must share at their start
 * for the template to be considered the one the entity was created from.
 */
const MINIMUM_SHARED_PREFIX = 3;

const entityLabels = {
	discussion: "discussion",
	issue: "issue",
	pull_request: "PR",
};

export const titleMeaningful = defineRule({
	about: {
		config: "recommended",
		description:
			"Titles should describe their entity, not be left as a template's default.",
		explanation: [
			`A title is the first part of a discussion, issue, or pull request that other contributors read.`,
			`Titles left as a template's default, or that don't say anything beyond it, make the work harder to find and triage.`,
			`This can easily happen if a contributor forgets to fill out the field.`,
		],
		name: "title-meaningful",
	},
	discussion: createTemplatedListener("discussion"),
	issue: createTemplatedListener("issue"),
	pullRequest(context, entity) {
		reportOnTitle(context, entity, undefined);
	},
});

/**
 * Creates a listener for an entity type whose templates can pre-fill a title.
 */
function createTemplatedListener(entityType: TemplatedEntityType) {
	return async (
		context: RuleContext,
		entity: DiscussionEntity | IssueEntity,
	) => {
		if (!entity.data.title.trim()) {
			return;
		}

		const templateTitles = await findTemplateTitles(
			context.octokit,
			context.locator,
			entityType,
		);

		reportOnTitle(
			context,
			entity,
			findNearestTemplateTitle(entity.data.title.trim(), templateTitles),
		);
	};
}

function reportOnTitle(
	context: RuleContext,
	entity: DiscussionEntity | IssueEntity | PullRequestEntity,
	templateTitle: string | undefined,
) {
	const title = entity.data.title.trim();
	if (!title) {
		return;
	}

	const label = entityLabels[entity.type];

	if (templateTitle && isUnchangedFromTemplate(title, templateTitle)) {
		context.report({
			primary: `This ${label}'s title still looks like the default title from its template.`,
			secondary: [`> ${templateTitle}`],
			suggestion: [
				`To resolve this report, edit the title to describe this specific ${label}.`,
			],
		});
		return;
	}

	if (
		areDocsInformative(title, [context.locator.repository, templateTitle ?? ""])
	) {
		return;
	}

	context.report({
		primary: `This ${label}'s title doesn't contain any words describing what it's about.`,
		secondary: [`> ${title}`],
		suggestion: [
			`To resolve this report, edit the title to summarize what this ${label} is about.`,
		],
	});
}

/**
 * @returns The template title the entity's title most looks like it came from.
 */
function findNearestTemplateTitle(title: string, templateTitles: string[]) {
	let nearest: string | undefined;
	let nearestLength = MINIMUM_SHARED_PREFIX - 1;

	for (const templateTitle of templateTitles) {
		const length = sharedPrefixLength(
			normalize(title),
			normalize(templateTitle),
		);
		if (length > nearestLength) {
			nearest = templateTitle;
			nearestLength = length;
		}
	}

	return nearest;
}

/**
 * @returns Whether the title is the template's title, or a cut-down version of it.
 */
function isUnchangedFromTemplate(title: string, templateTitle: string) {
	return normalize(templateTitle).startsWith(normalize(title));
}

function normalize(text: string) {
	return text.toLowerCase().replaceAll(/\s+/g, " ").trim();
}

function sharedPrefixLength(left: string, right: string) {
	let length = 0;

	while (
		length < left.length &&
		length < right.length &&
		left[length] === right[length]
	) {
		length += 1;
	}

	return length;
}
