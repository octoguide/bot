import type { Octokit } from "octokit";
import type { PartialDeep } from "type-fest";

import type { RepositoryLocator } from "../types/data.js";
import type { Entity, EntityType } from "../types/entities.js";
import type { Rule, RuleOptions, RuleReporter } from "../types/rules.js";

import { runRuleOnEntity } from "../execution/runRuleOnEntity.js";
import { createProxiedObject } from "./createProxiedObject.js";

export interface TestRuleContext {
	locator?: RepositoryLocator;
	octokit?: PartialDeep<Octokit>;
	options?: RuleOptions;
	report: RuleReporter;
}

const defaultLocator = {
	owner: "test-owner",
	repository: "test-repo",
};

const defaultOptions: RuleOptions = {
	"include-bots": true,
};

export async function testRule(
	rule: Rule,
	providedEntity: PartialDeep<Entity> & { type: EntityType },
	context: TestRuleContext,
) {
	const octokit = createProxiedObject<Octokit>(
		"context.octokit",
		context.octokit,
	);

	const entity = createProxiedObject<Entity>("entity", providedEntity);

	await runRuleOnEntity(
		{
			locator: defaultLocator,
			options: defaultOptions,
			...context,
			octokit,
		},
		rule,
		entity,
	);
}
