import type { Entity } from "../types/entities.js";

export function isEntityAssociationIncluded(
	entity: Entity,
	includeAssociations: Set<string> | undefined,
) {
	if (!includeAssociations || !("author_association" in entity.data)) {
		return true;
	}

	return includeAssociations.has(entity.data.author_association);
}
