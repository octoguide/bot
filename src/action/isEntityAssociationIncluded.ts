import { Entity } from "../types/entities";

/**
 * Determines if an entity should be included based on its author association.
 * Uses the author_association field from GitHub's webhook payload.
 * @param entity The entity to check
 * @param includeAssociations Set of allowed author associations
 * @returns true if the entity should be included, false if it should be skipped
 */
export function isEntityAssociationIncluded(
	entity: Entity,
	includeAssociations: Set<string>,
) {
	if ("author_association" in entity.data) {
		const association = entity.data.author_association;
		return includeAssociations.has(association);
	}

	return true;
}
