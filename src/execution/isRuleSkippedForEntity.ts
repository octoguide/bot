import { isEntityFromBot } from "../action/isEntityFromBot";
import { Entity } from "../types/entities";
import { RuleOptions } from "../types/rules";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	// TODO: include-associations?

	const includeBots = options["include-bots"];
	if (isEntityFromBot(entity) && !includeBots) {
		return true;
	}

	return true;
}
