// Code inspired by accessibility-alt-text-bot:
// https://github.com/github/accessibility-alt-text-bot/blob/14f7f7a37ea03b99b1ee9af234564ea4a18a2af9/src/validate.js
// TODO: see if we can extract a version that doesn't rely on markdownlint?
// https://github.com/JoshuaKGoldberg/OctoGuide/issues/33

import markdownlintGitHub from "@github/markdownlint-github";
import markdownlint from "markdownlint";

import type { Entity } from "../types/entities.js";
import type { Rule, RuleContext } from "../types/rules.js";

export const textImageAltText = {
	about: {
		config: "recommended",
		description: "Images should have descriptive alt text.",
		explanation: [
			`Alternative text, or "alt text", is a description attached to an image.`,
			`It allows non-sighted users and tools to understand the image despite not being able to visually see it.`,
		],
		name: "text-image-alt-text",
	},
	comment: checkEntity,
	issue: checkEntity,
	pullRequest: checkEntity,
} satisfies Rule;

function checkEntity(context: RuleContext, entity: Entity) {
	const body = entity.data.body?.trim();
	if (!body) {
		return undefined;
	}

	const { content: lintErrors } = markdownlint.sync({
		config: {
			default: false,
			"no-alt-text": true,
			"no-default-alt-text": true,
			"no-empty-alt-text": true,
		},
		customRules: markdownlintGitHub,
		handleRuleFailures: true,
		strings: { content: body },
	});

	if (!lintErrors.length) {
		return;
	}

	const lines = body.split(/\n/);

	for (const lintError of lintErrors) {
		context.report(createReportData(lines, lintError));
	}
}

function createReportData(lines: string[], lintError: markdownlint.LintError) {
	return {
		primary: ruleDescriptions[lintError.ruleNames[1]],
		secondary: [
			["> ```md", `> ${lines[lintError.lineNumber - 1]}`, "> ```"].join("\n"),
		],
		suggestion: [
			`To resolve this report, add descriptive alt text to the image.`,
		],
	};
}

const ruleDescriptions: Record<string, string> = {
	"no-alt-text": "The following image is missing alt text:",
	"no-default-alt-text":
		"The following image seems to have default alt text, rather than something informative:",
	"no-empty-alt-text": "The following image is missing alt text:",
};
