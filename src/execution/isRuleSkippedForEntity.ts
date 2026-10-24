import type { Entity } from "../types/entities.ts";
import type { RuleOptions } from "../types/rules.ts";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.ts";
import { isEntityFromAI } from "./isEntityFromAI.ts";
import { isEntityFromBot } from "./isEntityFromBot.ts";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	if (isEntityFromAI(entity)) {
		return !options["include-ais"];
	}

	return !options["include-bots"] && isEntityFromBot(entity);
}
