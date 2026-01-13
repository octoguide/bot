import { isEntityFromBot } from "../action/isEntityFromBot";
import { Entity } from "../types/entities";
import { Rule, RuleOptions } from "../types/rules";

export function isRuleSkippedForEntity(
	entity: Entity,
	options: RuleOptions,
	rule: Rule,
) {
	const includeAssociations = options["include-associations"]?.split(",");
	if (!includeAssociations) {
		// return false;
	}

	const includeBots = options["include-bots"];
	if (isEntityFromBot(entity) && !includeBots) {
		return true;
	}

	return true;
}
