import type { Rule } from "../types/rules.js";

import { wrapSafe } from "../types/utils.js";

export const prTaskCompletion = {
	about: {
		config: "recommended",
		description:
			"Tasks lists from the pull request template should be [x] filled out.",
		explanation: [
			`This repository provides a set of tasks that pull request authors are expected to complete.`,
			`Those tasks should be marked as completed with a \`[x]\` in the pull request description.`,
		],
		name: "pr-conventional-title",
	},
	async pullRequest(context, entity) {
		const templateResponse = await wrapSafe(
			context.octokit.rest.repos.getContent({
				owner: context.locator.owner,
				path: ".github/PULL_REQUEST_TEMPLATE.md",
				repo: context.locator.repository,
			}),
		);

		if (
			!templateResponse ||
			Array.isArray(templateResponse.data) ||
			templateResponse.data.type !== "file"
		) {
			return;
		}

		const template = Buffer.from(
			templateResponse.data.content,
			"base64",
		).toString("utf-8");
		const templateTasks = Array.from(
			template.matchAll(/[-*]\s*\[\s*\]\s*(.+)/g),
		);
		if (!templateTasks.length) {
			return;
		}

		if (!entity.data.body) {
			context.report({
				primary:
					"This PR's body is empty, but there is a template with tasks to be done.",
				secondary: [
					"Please fill out the pull request template and make sure all the tasks are [x] checked.",
				],
			});
			return;
		}

		const bodyNormalized = normalizeWhitespace(entity.data.body);

		const missingTasks = templateTasks
			.filter(
				(task) =>
					!bodyNormalized.includes(
						normalizeWhitespace(task[0])
							// Switch the "- [ ]" to "x"
							.replace(/[-*]\[\]/, "[x]")
							// Trim any swap-out text, like ": fixes #000"...
							.split(/[:#]/)[0],
					),
			)
			.map((task) => task[0]);

		if (!missingTasks.length) {
			return;
		}

		context.report({
			primary:
				"This PR's body is missing [x] checks on the following the tasks from the PR template.",
			secondary: missingTasks,
		});
	},
} satisfies Rule;

function normalizeWhitespace(text: string) {
	return text.replaceAll(/[ \t]/g, "");
}
