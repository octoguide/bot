import type { Entity } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.js";
import { isEntityFromBot } from "./isEntityFromBot.js";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	return !options["include-bots"] && isEntityFromBot(entity);
}
