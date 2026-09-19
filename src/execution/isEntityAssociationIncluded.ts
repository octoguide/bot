import type { Entity } from "../types/entities.js";

export function isEntityAssociationIncluded(
	entity: Entity,
	includeAssociations: Set<string> | undefined,
) {
	if (!includeAssociations) {
		return true;
	}

	const association =
		"author_association" in entity.data
			? entity.data.author_association
			: undefined;

	return !association || includeAssociations.has(association);
}
