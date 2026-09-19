import type { Entity } from "../types/entities.js";

export function isEntityFromBot(entity: Entity) {
	return (
		"user" in entity.data &&
		!!entity.data.user &&
		"type" in entity.data.user &&
		entity.data.user.type === "Bot"
	);
}
