import type { Entity } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.js";
import { isEntityFromAI } from "./isEntityFromAI.js";
import { isEntityFromBot } from "./isEntityFromBot.js";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	if (isEntityFromAI(entity)) {
		return !options["include-ais"];
	}

	return !options["include-bots"] && isEntityFromBot(entity);
}
