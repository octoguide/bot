import type { Entity } from "../types/entities.ts";
import type { RuleOptions } from "../types/rules.ts";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.ts";
import { isEntityFromBot } from "./isEntityFromBot.ts";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	return !options["include-bots"] && isEntityFromBot(entity);
}
