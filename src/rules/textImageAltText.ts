// Code inspired by accessibility-alt-text-bot:
// https://github.com/github/accessibility-alt-text-bot/blob/14f7f7a37ea03b99b1ee9af234564ea4a18a2af9/src/validate.js
// TODO: see if we can extract a version that doesn't rely on markdownlint?
// https://github.com/OctoGuide/bot/issues/33
import type MarkdownIt from "markdown-it";
import type { LintError, Options } from "markdownlint";

import markdownlintGitHub from "@github/markdownlint-github";
import MarkdownItParser from "markdown-it";
import { lint } from "markdownlint/sync";

import type { Entity } from "../types/entities.js";
import type { RuleContext } from "../types/rules.js";

import { defineRule } from "./defineRule.js";

export const textImageAltText = defineRule({
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
	discussion: checkEntity,
	issue: checkEntity,
	pullRequest: checkEntity,
});

function checkEntity(context: RuleContext, entity: Entity) {
	const body = entity.data.body?.trim();
	if (!body) {
		return undefined;
	}

	// Factory function for creating markdown-it instances
	const createMarkdownIt = (): MarkdownIt => {
		return MarkdownItParser({ html: true });
	};

	const options: Options = {
		config: {
			default: false,
			"no-alt-text": true,
			"no-default-alt-text": true,
			"no-empty-alt-text": true,
		},
		customRules: markdownlintGitHub,
		handleRuleFailures: true,
		markdownItFactory: createMarkdownIt,
		strings: { content: body },
	};

	const { content: lintErrors } = lint(options);

	if (!lintErrors.length) {
		return;
	}

	const lines = body.split(/\n/);

	for (const lintError of lintErrors) {
		context.report(createReportData(lines, lintError));
	}
}

function createReportData(lines: string[], lintError: LintError) {
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
