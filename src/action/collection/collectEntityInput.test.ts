import { describe, expect, it } from "vitest";

import type { EntityData } from "../../types/entities.js";

import { collectEntityInput } from "./collectEntityInput.js";

const createTarget = (data: object) => data as EntityData;

describe("collectEntityInput", () => {
	it("throws an error when the URL is not a known entity URL", () => {
		expect(() =>
			collectEntityInput({}, createTarget({}), "https://github.com/test/repo"),
		).toThrow(
			"Could not determine entity type from URL: https://github.com/test/repo",
		);
	});

	it("returns a pull request entity when given a pull request URL", () => {
		const target = createTarget({
			html_url: "https://github.com/test/repo/pull/1",
		});

		const actual = collectEntityInput(
			{},
			target,
			"https://github.com/test/repo/pull/1",
		);

		expect(actual).toEqual({ data: target, number: 1, type: "pull_request" });
	});

	it("returns an issue entity when given an issue URL", () => {
		const target = createTarget({
			html_url: "https://github.com/test/repo/issues/2",
		});

		const actual = collectEntityInput(
			{},
			target,
			"https://github.com/test/repo/issues/2",
		);

		expect(actual).toEqual({ data: target, number: 2, type: "issue" });
	});

	it("returns a discussion entity when given a discussion URL", () => {
		const target = createTarget({
			html_url: "https://github.com/test/repo/discussions/3",
		});

		const actual = collectEntityInput(
			{},
			target,
			"https://github.com/test/repo/discussions/3",
		);

		expect(actual).toEqual({ data: target, number: 3, type: "discussion" });
	});

	it("returns a comment entity when given a comment URL", () => {
		const target = createTarget({
			html_url: "https://github.com/test/repo/issues/4#issuecomment-5",
			id: 5,
		});

		const actual = collectEntityInput(
			{ issue: { number: 4 } },
			target,
			"https://github.com/test/repo/issues/4#issuecomment-5",
		);

		expect(actual).toEqual({
			commentId: 5,
			data: target,
			parentNumber: 4,
			parentType: "issue",
			type: "comment",
		});
	});

	it("throws an error when comment data is missing an id", () => {
		expect(() =>
			collectEntityInput(
				{},
				createTarget({
					html_url: "https://github.com/test/repo/issues/4#issuecomment-5",
				}),
				"https://github.com/test/repo/issues/4#issuecomment-5",
			),
		).toThrow("Invalid comment data structure.");
	});

	it("throws an error when discussion data is missing an html_url", () => {
		expect(() =>
			collectEntityInput(
				{},
				createTarget({}),
				"https://github.com/test/repo/discussions/3",
			),
		).toThrow("Invalid discussion data structure.");
	});

	it("throws an error when issue data is missing an html_url", () => {
		expect(() =>
			collectEntityInput(
				{},
				createTarget({}),
				"https://github.com/test/repo/issues/2",
			),
		).toThrow("Invalid issue data structure.");
	});

	it("throws an error when pull request data is missing an html_url", () => {
		expect(() =>
			collectEntityInput(
				{},
				createTarget({}),
				"https://github.com/test/repo/pull/1",
			),
		).toThrow("Invalid pull request data structure.");
	});
});
