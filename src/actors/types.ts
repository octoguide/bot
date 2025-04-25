import { CommentData, Entity, EntityData } from "../types/entities.js";

export interface EntityActor<Data extends EntityData = EntityData> {
	readonly metadata: Omit<Entity, "data">;

	// These should all be abstract in implementing classes...
	createComment(body: string): Promise<string>;
	getData(): Promise<Data>;
	listComments(): Promise<CommentData[]>;
	updateComment(number: number, newBody: string): Promise<void>;
}
