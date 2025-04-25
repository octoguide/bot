import type { Entity } from "../types/entities.js";
import type { Rule, RuleContext } from "../types/rules.js";

export async function runRuleOnEntity(
	context: RuleContext,
	rule: Rule,
	entity: Entity,
) {
	switch (entity.type) {
		case "comment":
			await rule.comment?.(context, entity);
			break;

		case "discussion":
			await rule.discussion?.(context, entity);
			break;

		case "issue":
			await rule.issue?.(context, entity);
			break;

		case "pull_request":
			await rule.pullRequest?.(context, entity);
			break;
	}
}
