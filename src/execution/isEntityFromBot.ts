import type { Entity } from "../types/entities.js";

type EntityFromBot = Entity & {
	data: { user: { login: string; type: "Bot" } };
};

export function isEntityFromBot(entity: Entity): entity is EntityFromBot {
	return (
		"user" in entity.data &&
		!!entity.data.user &&
		"type" in entity.data.user &&
		entity.data.user.type === "Bot"
	);
}
