import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { commentMeaningful } from "./commentMeaningful.js";

describe(commentMeaningful.about.name, () => {
	it("does not report when the comment has no body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningful,
			{
				data: {
					body: "",
				},
				type: "comment",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the comment has meaningful body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningful,
			{
				data: {
					body: "mmh, yes, indeed, a fine point, thank you 🧐",
				},
				type: "comment",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the comment has meaningless body text", async () => {
		const report = vi.fn();

		await testRule(
			commentMeaningful,
			{
				data: {
					body: "+1",
				},
				parentType: "issue",
				type: "comment",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: `Saying just _"+1"_ doesn't add any new information to the discussion.`,
			suggestion: [
				`To resolve this report:`,
				`* If you have new information that'll help the discussion, edit it into the comment`,
				`* Otherwise, delete the comment and emoji react to the issue`,
			],
		});
	});
});
