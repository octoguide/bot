import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type {
	Entity,
	IssueData,
	PullRequestData,
} from "../../types/entities.js";

import { collectEditor } from "./collectEditor.js";

const entity: Entity = {
	data: { user: { login: "author" } } as PartialDeep<IssueData> as IssueData,
	number: 1,
	type: "issue",
};

const pullRequestEntity: Entity = {
	data: {
		user: { login: "author" },
	} as PartialDeep<PullRequestData> as PullRequestData,
	number: 1,
	type: "pull_request",
};

const bodyChanges = { body: { from: "Old body." } };

describe("collectEditor", () => {
	it("returns undefined when the payload is not an edit", () => {
		const actual = collectEditor(
			{ action: "opened", sender: { login: "other", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the payload has no sender", () => {
		const actual = collectEditor(
			{ action: "edited", changes: bodyChanges },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the entity is edited by its author", () => {
		const actual = collectEditor(
			{
				action: "edited",
				changes: bodyChanges,
				sender: { login: "author", type: "User" },
			},
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the payload has no changes", () => {
		const actual = collectEditor(
			{ action: "edited", sender: { login: "other", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when a pull request's base is the only change", () => {
		const actual = collectEditor(
			{
				action: "edited",
				changes: { base: { ref: { from: "old" }, sha: { from: "abc123" } } },
				sender: { login: "other", type: "User" },
			},
			pullRequestEntity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns the editor when someone other than the author edits the body", () => {
		const actual = collectEditor(
			{
				action: "edited",
				changes: bodyChanges,
				sender: { id: 2, login: "other", type: "User" },
			},
			entity,
		);

		expect(actual).toEqual({ login: "other", type: "User" });
	});

	it("returns the editor when someone other than the author edits a pull request's title", () => {
		const actual = collectEditor(
			{
				action: "edited",
				changes: { title: { from: "Old title" } },
				sender: { login: "other", type: "User" },
			},
			pullRequestEntity,
		);

		expect(actual).toEqual({ login: "other", type: "User" });
	});

	it("returns the editor when someone other than the author edits a pull request's body and base", () => {
		const actual = collectEditor(
			{
				action: "edited",
				changes: { ...bodyChanges, base: { ref: { from: "old" } } },
				sender: { login: "renovate[bot]", type: "Bot" },
			},
			pullRequestEntity,
		);

		expect(actual).toEqual({ login: "renovate[bot]", type: "Bot" });
	});
});
