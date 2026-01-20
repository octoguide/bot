import { describe, expect, it } from "vitest";

import { parseCommentId, parseEntityUrl } from "./parseEntity.js";

describe("parseEntityUrl", () => {
	it("should parse issue URL", () => {
		const result = parseEntityUrl("https://github.com/owner/repo/issues/123");
		expect(result).toEqual(["issues", "123"]);
	});

	it("should parse pull request URL", () => {
		const result = parseEntityUrl("https://github.com/owner/repo/pull/456");
		expect(result).toEqual(["pull", "456"]);
	});

	it("should parse discussion URL", () => {
		const result = parseEntityUrl(
			"https://github.com/owner/repo/discussions/789",
		);
		expect(result).toEqual(["discussions", "789"]);
	});

	it("should return undefined for invalid URL", () => {
		const result = parseEntityUrl("https://github.com/owner/repo/invalid");
		expect(result).toBeUndefined();
	});
});

describe("parseCommentId", () => {
	it("should parse issue comment ID", () => {
		const result = parseCommentId(
			"https://github.com/owner/repo/issues/123#issuecomment-456",
		);
		expect(result).toBe("456");
	});

	it("should parse discussion comment ID", () => {
		const result = parseCommentId(
			"https://github.com/owner/repo/discussions/789#discussioncomment-321",
		);
		expect(result).toBe("321");
	});

	it("should parse pull request review comment ID", () => {
		const result = parseCommentId(
			"https://github.com/owner/repo/pull/1513#discussion_r2699746747",
		);
		expect(result).toBe("2699746747");
	});

	it("should return undefined for non-comment URL", () => {
		const result = parseCommentId("https://github.com/owner/repo/issues/123");
		expect(result).toBeUndefined();
	});
});
