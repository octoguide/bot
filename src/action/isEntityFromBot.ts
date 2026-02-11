import { Entity } from "../types/entities";

/**
 * Determines if an entity was created by a bot based on the user.type field.
 * @param entity The entity to check
 * @returns true if the entity was created by a bot (user.type === "Bot"), false otherwise
 */
export function isEntityFromBot(entity: Entity) {
	return (
		"user" in entity.data &&
		!!entity.data.user &&
		"type" in entity.data.user &&
		entity.data.user.type === "Bot"
	);
}
