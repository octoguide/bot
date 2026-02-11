import { isEntityAssociationIncluded } from "../action/isEntityAssociationIncluded";
import { isEntityFromBot } from "../action/isEntityFromBot";
import { Entity } from "../types/entities";
import { RuleOptions } from "../types/rules";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	const includeAssociations = options["include-associations"];
	if (
		includeAssociations &&
		!isEntityAssociationIncluded(entity, includeAssociations)
	) {
		return true;
	}

	const includeBots = options["include-bots"];
	if (!includeBots && isEntityFromBot(entity)) {
		return true;
	}

	return true;
}
