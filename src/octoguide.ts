import { octokitFromAuth } from "octokit-from-auth";

import type { EntityActor } from "./actors/types.js";
import type { ConfigName } from "./types/configs.js";
import type { Entity } from "./types/entities.js";
import type { RuleContext, RuleReport } from "./types/rules.js";

import { actorFactory } from "./actors/actorFactory.js";
import { resolveLocator } from "./actors/resolveLocator.js";
import { runRuleOnEntity } from "./execution/runRuleOnEntity.js";
import { configs } from "./rules/configs.js";

export interface OctoGuideResult {
	actor: EntityActor;
	entity: Entity;
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

	const locator = resolveLocator(url);
	if (!locator) {
		throw new Error("Could not resolve GitHub entity locator.");
	}

	const actor = actorFactory(locator, octokit, url);
	if (!actor) {
		throw new Error("Could not resolve GitHub entity actor.");
	}

	const entity = {
		data: await actor.getData(),
		...actor.metadata,
	} as Entity;
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

	return { actor, entity, reports };
}
