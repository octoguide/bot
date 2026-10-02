import type { PartialDeep } from "type-fest";

import type { RepositoryLocator } from "../types/data.ts";
import type { Entity, EntityType } from "../types/entities.ts";
import type { LocatedOctokit } from "../types/octokit.ts";
import type { Rule, RuleOptions, RuleReporter } from "../types/rules.ts";

import { runRuleOnEntity } from "../execution/runRuleOnEntity.ts";
import { createProxiedObject } from "./createProxiedObject.ts";
import { testLocator } from "./testLocator.ts";

export interface TestRuleContext {
	locator?: RepositoryLocator;
	octokit?: PartialDeep<LocatedOctokit>;
	options?: RuleOptions;
	report: RuleReporter;
}

const defaultOptions: RuleOptions = {
	"include-bots": true,
};

export async function testRule(
	rule: Rule,
	providedEntity: PartialDeep<Entity> & { type: EntityType },
	context: TestRuleContext,
) {
	const octokit = createProxiedObject<LocatedOctokit>(
		"context.octokit",
		context.octokit,
	);

	const entity = createProxiedObject<Entity>("entity", providedEntity);

	await runRuleOnEntity(
		{
			locator: testLocator,
			options: defaultOptions,
			...context,
			octokit,
		},
		rule,
		entity,
	);
}
