import { describe, expect, test } from "vitest";

import type { CommentEntity, DiscussionEntity } from "../types/entities.js";

import { createHeadlineAsMarkdown } from "./createHeadlineAsMarkdown.js";

const commentEntity = {
	data: {
		html_url: "github.com/owner/repo/discussions/123#discussioncomment-456",
		id: 123,
		user: {
			login: "test-user",
		},
	},
	type: "comment",
} as CommentEntity;

const discussionEntity = {
	data: {
		html_url: "github.com/owner/repo/discussions/123",
	},
	number: 123,
	type: "discussion",
} as DiscussionEntity;

describe(createHeadlineAsMarkdown, () => {
	test("anonymous comment with one report", () => {
		const actual = createHeadlineAsMarkdown(
			{
				...commentEntity,
				data: {
					...commentEntity.data,
					user: null,
				},
			},
			[{}],
		);

		expect(actual).toMatchInlineSnapshot(
			`"👋 Hi, thanks for the [comment](github.com/owner/repo/discussions/123#discussioncomment-456 "comment 123 reported by OctoGuide")! A scan flagged a concern with it. Could you please take a look?"`,
		);
	});

	test("named comment with one report", () => {
		const actual = createHeadlineAsMarkdown(commentEntity, [{}]);

		expect(actual).toMatchInlineSnapshot(
			`"👋 Hi @test-user, thanks for the [comment](github.com/owner/repo/discussions/123#discussioncomment-456 "comment 123 reported by OctoGuide")! A scan flagged a concern with it. Could you please take a look?"`,
		);
	});

	test("named comment with two reports", () => {
		const actual = createHeadlineAsMarkdown(commentEntity, [{}, {}]);

		expect(actual).toMatchInlineSnapshot(
			`"👋 Hi @test-user, thanks for the [comment](github.com/owner/repo/discussions/123#discussioncomment-456 "comment 123 reported by OctoGuide")! A scan flagged some concerns with it. Could you please take a look?"`,
		);
	});

	test("discussion with one report", () => {
		const actual = createHeadlineAsMarkdown(discussionEntity, [{}]);

		expect(actual).toMatchInlineSnapshot(
			`"👋 Hi, thanks for the discussion! A scan flagged a concern with it. Could you please take a look?"`,
		);
	});

	test("discussion with two reports", () => {
		const actual = createHeadlineAsMarkdown(discussionEntity, [{}, {}]);

		expect(actual).toMatchInlineSnapshot(
			`"👋 Hi, thanks for the discussion! A scan flagged some concerns with it. Could you please take a look?"`,
		);
	});
});
