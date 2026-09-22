import { areDocsInformative } from "are-docs-informative";

import type { IssueLikeEntity } from "../types/entities.js";
import type { RuleContext } from "../types/rules.js";

import { findIssueTemplateTitles } from "../action/findIssueTemplateTitles.js";
import { defineRule } from "./defineRule.js";

/**
 * How many characters a title and a template's title must share at their start
 * for the template to be considered the one the entity was created from.
 */
const MINIMUM_SHARED_PREFIX = 3;

export const textTitleMeaningful = defineRule({
	about: {
		config: "recommended",
		description:
			"Titles should describe the issue or PR, not be left as a template's default.",
		explanation: [
			`A title is the first -- and often only -- part of an issue or pull request that other contributors read.`,
			`Titles left as a template's default, or that don't say anything beyond it, make the work harder to find and triage.`,
		],
		name: "text-title-meaningful",
	},
	async issue(context, entity) {
		const title = entity.data.title.trim();
		if (!title) {
			return;
		}

		const templateTitle = findNearestTemplateTitle(
			title,
			await findIssueTemplateTitles(context.octokit, context.locator),
		);

		if (templateTitle && isUnchangedFromTemplate(title, templateTitle)) {
			context.report({
				primary: `This issue's title still looks like the default title from its template.`,
				secondary: [`> ${templateTitle}`],
				suggestion: [
					`To resolve this report, edit the title to describe this specific issue.`,
				],
			});
			return;
		}

		reportIfUninformative(context, entity, templateTitle);
	},
	pullRequest(context, entity) {
		// Pull request templates can't pre-fill a title, so there's none to compare to.
		reportIfUninformative(context, entity, undefined);
	},
});

function reportIfUninformative(
	context: RuleContext,
	entity: IssueLikeEntity,
	templateTitle: string | undefined,
) {
	const title = entity.data.title.trim();
	if (!title) {
		return;
	}

	// The title has to contribute a word that isn't already implied by the
	// repository it's filed in or the template it was created from.
	const known = [context.locator.repository, templateTitle ?? ""];
	if (areDocsInformative(title, known)) {
		return;
	}

	const label = entity.type === "issue" ? "issue" : "PR";

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
