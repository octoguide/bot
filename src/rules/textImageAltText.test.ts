import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { textImageAltText } from "./textImageAltText.js";

describe(textImageAltText.about.name, () => {
	it("does not report when the entity does not have a body", async () => {
		const report = vi.fn();

		await testRule(
			textImageAltText,
			{
				data: {},
				type: "issue",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the entity does not have images in its body", async () => {
		const report = vi.fn();

		await testRule(
			textImageAltText,
			{
				data: {
					body: "Test body.",
				},
				type: "issue",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the body has an image with seemingly acceptable alt text.", async () => {
		const report = vi.fn();

		await testRule(
			textImageAltText,
			{
				data: {
					body: "![Test image description](img.jpg)",
				},
				type: "issue",
			},
			{ report },
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when an image is missing alt text.", async () => {
		const report = vi.fn();

		await testRule(
			textImageAltText,
			{
				data: {
					body: "![](img.jpg)",
				},
				type: "issue",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: "The following image is missing alt text:",
			secondary: [["> ```md", "> ![](img.jpg)", "> ```"].join("\n")],
		});
	});

	it("reports when an image has seemingly default alt text (extended).", async () => {
		const report = vi.fn();

		await testRule(
			textImageAltText,
			{
				data: {
					body: "![Screen Shot 2025-06-26 at 7 41 30 PM](img.jpg)",
				},
				type: "issue",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"The following image seems to have default alt text, rather than something informative:",
			secondary: [
				[
					"> ```md",
					"> ![Screen Shot 2025-06-26 at 7 41 30 PM](img.jpg)",
					"> ```",
				].join("\n"),
			],
		});
	});
});
