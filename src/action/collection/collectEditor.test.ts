import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type { Entity, IssueData } from "../../types/entities.js";

import { collectEditor } from "./collectEditor.js";

const entity: Entity = {
	data: { user: { login: "author" } } as PartialDeep<IssueData> as IssueData,
	number: 1,
	type: "issue",
};

describe("collectEditor", () => {
	it("returns undefined when the payload is not an edit", () => {
		const actual = collectEditor(
			{ action: "opened", sender: { login: "other", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the payload has no sender", () => {
		const actual = collectEditor({ action: "edited" }, entity);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the entity is edited by its author", () => {
		const actual = collectEditor(
			{ action: "edited", sender: { login: "author", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns the editor when the entity is edited by someone other than its author", () => {
		const actual = collectEditor(
			{ action: "edited", sender: { id: 2, login: "other", type: "User" } },
			entity,
		);

		expect(actual).toEqual({ login: "other", type: "User" });
	});
});
