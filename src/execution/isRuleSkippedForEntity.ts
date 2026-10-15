import type { Entity } from "../types/entities.ts";
import type { RuleOptions } from "../types/rules.ts";

import { isEntityAssociationIncluded } from "./isEntityAssociationIncluded.ts";
import { isRuleSkippedForUser } from "./isRuleSkippedForUser.ts";

export function isRuleSkippedForEntity(entity: Entity, options: RuleOptions) {
	if (!isEntityAssociationIncluded(entity, options["include-associations"])) {
		return true;
	}

	const { user } = entity.data;

	return !!user && isRuleSkippedForUser(user, options);
}
