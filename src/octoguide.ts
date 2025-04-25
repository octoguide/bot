import type { Octokit } from "octokit";

import { octokitFromAuth } from "octokit-from-auth";

import type { ConfigName } from "./types/configs.js";
import type { RepositoryLocator } from "./types/data.js";
import type { Entity } from "./types/entities.js";
import type { RuleContext, RuleReport } from "./types/rules.js";

import { runRuleOnEntity } from "./execution/runRuleOnEntity.js";
import { resolveLintable } from "./resolvers/resolveEntity.js";
import { configs } from "./rules/configs.js";

export interface OctoGuideResult {
	entity: Entity;
	locator: RepositoryLocator;
	octokit: Octokit;
	reports: RuleReport[];
}

export interface OctoGuideSettings {
	config?: ConfigName | undefined;
	githubToken?: string | undefined;
	url: string;
}

export async function runOctoGuide({
	config = "recommended",
	githubToken,
	url,
}: OctoGuideSettings): Promise<OctoGuideResult> {
	const octokit = await octokitFromAuth({
		auth: githubToken,
	});

	const resolved = await resolveLintable(octokit, url);
	if (!resolved) {
		throw new Error("Could not resolve GitHub entity.");
	}

	const { entity, locator } = resolved;
	const reports: RuleReport[] = [];

	await Promise.all(
		Object.values(configs[config]).map(async (rule) => {
			const context: RuleContext = {
				locator,
				octokit,
				report(data) {
					reports.push({
						about: rule.about,
						data,
					});
				},
			};

			await runRuleOnEntity(context, rule, entity);
		}),
	);

	return { entity, locator, octokit, reports };
}
