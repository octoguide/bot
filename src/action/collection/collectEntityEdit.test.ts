import type { PartialDeep } from "type-fest";

import { describe, expect, it } from "vitest";

import type {
	Entity,
	IssueData,
	PullRequestData,
} from "../../types/entities.js";

import { collectEntityEdit } from "./collectEntityEdit.js";

const entity: Entity = {
	data: {
		body: "New body.",
		title: "New title",
		user: { login: "author" },
	} as PartialDeep<IssueData> as IssueData,
	number: 1,
	type: "issue",
};

const pullRequestEntity: Entity = {
	data: {
		body: "New body.",
		title: "New title",
		user: { login: "author" },
	} as PartialDeep<PullRequestData> as PullRequestData,
	number: 1,
	type: "pull_request",
};

const bodyChanges = { body: { from: "Old body." } };

describe("collectEdit", () => {
	it("returns undefined when the payload is not an edit", () => {
		const actual = collectEntityEdit(
			{ action: "opened", sender: { login: "other", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the payload has no sender", () => {
		const actual = collectEntityEdit(
			{ action: "edited", changes: bodyChanges },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when the entity is edited by its author", () => {
		const actual = collectEntityEdit(
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
		const actual = collectEntityEdit(
			{ action: "edited", sender: { login: "other", type: "User" } },
			entity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns undefined when a pull request's base is the only change", () => {
		const actual = collectEntityEdit(
			{
				action: "edited",
				changes: { base: { ref: { from: "old" }, sha: { from: "abc123" } } },
				sender: { login: "other", type: "User" },
			},
			pullRequestEntity,
		);

		expect(actual).toBeUndefined();
	});

	it("returns the editor and the previous body when someone other than the author edits the body", () => {
		const actual = collectEntityEdit(
			{
				action: "edited",
				changes: bodyChanges,
				sender: { id: 2, login: "other", type: "User" },
			},
			entity,
		);

		expect(actual).toEqual({
			editor: { login: "other", type: "User" },
			previous: {
				...entity,
				data: { ...entity.data, body: "Old body." },
			},
		});
	});

	it("returns the editor and the previous title when someone other than the author edits a pull request's title", () => {
		const actual = collectEntityEdit(
			{
				action: "edited",
				changes: { title: { from: "Old title" } },
				sender: { login: "other", type: "User" },
			},
			pullRequestEntity,
		);

		expect(actual).toEqual({
			editor: { login: "other", type: "User" },
			previous: {
				...pullRequestEntity,
				data: { ...pullRequestEntity.data, title: "Old title" },
			},
		});
	});

	it("returns the editor and the previous body and title when someone other than the author edits a pull request's body, title, and base", () => {
		const actual = collectEntityEdit(
			{
				action: "edited",
				changes: {
					...bodyChanges,
					base: { ref: { from: "old" } },
					title: { from: "Old title" },
				},
				sender: { login: "renovate[bot]", type: "Bot" },
			},
			pullRequestEntity,
		);

		expect(actual).toEqual({
			editor: { login: "renovate[bot]", type: "Bot" },
			previous: {
				...pullRequestEntity,
				data: {
					...pullRequestEntity.data,
					body: "Old body.",
					title: "Old title",
				},
			},
		});
	});

	it("does not modify the entity when creating its previous version", () => {
		collectEntityEdit(
			{
				action: "edited",
				changes: bodyChanges,
				sender: { login: "other", type: "User" },
			},
			entity,
		);

		expect(entity.data.body).toBe("New body.");
	});
});
