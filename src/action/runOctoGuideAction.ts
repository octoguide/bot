import type * as github from "@actions/github";

import * as core from "@actions/core";

import { parseEntityUrl } from "../actors/parseEntityUrl.js";
import { runOctoGuideRules } from "../index.js";
import { cliReporter } from "../reporters/cliReporter.js";
import { allRules } from "../rules/all.js";
import { isKnownConfig } from "../rules/configs.js";
import { Entity, EntityData } from "../types/entities.js";
import { outputActionReports } from "./comments/outputActionReports.js";
import { runCommentCleanup } from "./runCommentCleanup.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;
	if (!payload.action) {
		core.info("Unknown payload action. Exiting.");
		return;
	}

	core.debug(`Full target payload: ${JSON.stringify(payload, null, 2)}`);

	const target = (payload.comment ??
		payload.discussion ??
		payload.issue ??
		payload.pull_request) as EntityData | undefined;
	if (!target) {
		throw new Error("Could not determine an entity to run OctoGuide on.");
	}

	const url = target.html_url;
	if (typeof url !== "string") {
		throw new Error("Target entity's html_url is not a string.");
	}

	const auth = core.getInput("github-token") || process.env.GITHUB_TOKEN;
	if (!auth) {
		throw new Error("Please provide a with.github-token to octoguide.");
	}

	core.info(`Targeting ${payload.action} entity at html_url: ${url}`);

	if (payload.action === "deleted") {
		await runCommentCleanup({ auth, payload, url });
		return;
	}

	const config = core.getInput("config") || "recommended";
	if (!isKnownConfig(config)) {
		throw new Error(`Unknown config provided: ${config}`);
	}

	const rules = allRules.reduce((acc: Record<string, boolean>, rule) => {
		const ruleInput = core.getInput(`rule-${rule.about.name}`);

		if (!ruleInput) {
			return acc;
		}

		acc[rule.about.name] = ruleInput === "true";

		return acc;
	}, {});

	const settings = {
		comments: {
			footer:
				core.getInput("comment-footer") ||
				"🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices.",
			header: core.getInput("comment-header"),
		},
		config,
		rules,
	};

	const matches = parseEntityUrl(url);
	if (!matches) {
		throw new Error(`Could not determine entity type from URL: ${url}`);
	}

	const [urlType] = matches;
	const entityType =
		urlType === "discussions"
			? "discussion"
			: urlType === "issues"
				? "issue"
				: "pull_request";

	const entityNumber =
		"number" in target && typeof target.number === "number" && target.number > 0
			? target.number
			: (() => {
					throw new Error("Entity payload missing valid number property");
				})();

	const entityInput: Entity = {
		data: target,
		number: entityNumber,
		type: entityType,
	} as Entity;

	/**
	 * Determines if an entity was created by a bot based on the user.type field.
	 * @param entity The entity to check
	 * @returns true if the entity was created by a bot (user.type === "Bot"), false otherwise
	 */
	const isEntityFromBot = (entity: Entity): boolean => {
		return (
			"user" in entity.data &&
			!!entity.data.user &&
			"type" in entity.data.user &&
			entity.data.user.type === "Bot"
		);
	};

	const includeBots = core.getInput("include-bots") === "true";
	if (!includeBots && isEntityFromBot(entityInput)) {
		core.info(`Skipping OctoGuide rules for bot-created ${entityType}: ${url}`);
		return;
	}

	/**
	 * Determines if an entity was created by a collaborator (including owners).
	 * Uses the author_association field from GitHub's webhook payload.
	 * @param entity The entity to check
	 * @returns true if the entity was created by a collaborator, false otherwise
	 */
	const isEntityFromCollaborator = (entity: Entity): boolean => {
		if ("author_association" in entity.data) {
			const association = entity.data.author_association;
			return association === "COLLABORATOR" || association === "OWNER";
		}

		return false;
	};

	const includeCollaborators =
		core.getInput("include-collaborators") === "true";
	if (!includeCollaborators && isEntityFromCollaborator(entityInput)) {
		core.info(
			`Skipping OctoGuide rules for collaborator-created ${entityType}: ${url}`,
		);
		return;
	}

	const { actor, entity, reports } = await runOctoGuideRules({
		auth,
		entity: entityInput,
		settings,
	});

	if (reports.length) {
		core.info(`Found ${reports.length} report(s).`);
		console.log(cliReporter(reports));
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	await outputActionReports(actor, entity, reports, settings);
}
