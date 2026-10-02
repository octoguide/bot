import { describe, expect, it } from "vitest";

import { isEditorIncluded } from "./isEditorIncluded.js";

const collaborator = { login: "collaborator", type: "User" };
const owner = { login: "owner", type: "User" };

describe("isEditorIncluded", () => {
	it("returns true when associations are not restricted", () => {
		const actual = isEditorIncluded(collaborator, "owner", {});

		expect(actual).toBe(true);
	});

	it("returns false when a bot edits and bots are excluded", () => {
		const actual = isEditorIncluded(
			{ login: "renovate[bot]", type: "Bot" },
			"owner",
			{ "include-bots": false },
		);

		expect(actual).toBe(false);
	});

	it("returns true when a bot edits and bots are included", () => {
		const actual = isEditorIncluded(
			{ login: "renovate[bot]", type: "Bot" },
			"owner",
			{ "include-associations": ["CONTRIBUTOR"], "include-bots": true },
		);

		expect(actual).toBe(true);
	});

	it("returns false when a non-owner edits and neither collaborators nor members are included", () => {
		const actual = isEditorIncluded(collaborator, "owner", {
			"include-associations": ["FIRST_TIMER", "CONTRIBUTOR", "OWNER"],
		});

		expect(actual).toBe(false);
	});

	it.each(["COLLABORATOR", "MEMBER"])(
		"returns true when a non-owner edits and %s is included",
		(association) => {
			const actual = isEditorIncluded(collaborator, "owner", {
				"include-associations": [association],
			});

			expect(actual).toBe(true);
		},
	);

	it("returns false when the owner edits and owners are not included", () => {
		const actual = isEditorIncluded(owner, "owner", {
			"include-associations": ["COLLABORATOR", "MEMBER"],
		});

		expect(actual).toBe(false);
	});

	it("returns true when the owner edits and owners are included", () => {
		const actual = isEditorIncluded(owner, "owner", {
			"include-associations": ["OWNER"],
		});

		expect(actual).toBe(true);
	});
});
