import type { Entity } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.js";
import { isRuleSkippedForUser } from "./isRuleSkippedForUser.js";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	const { user } = entity.data;

	return !!user && isRuleSkippedForUser(user, options);
}
