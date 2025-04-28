import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prBodyNotEmpty } from "./prBodyNotEmpty.js";

describe(prBodyNotEmpty.about.name, () => {
	it("reports when the pull request has no description", async () => {
		const report = vi.fn();

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body: null,
				},
				type: "pull_request",
			},
			{ report },
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This PR doesn't have a description.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("reports when the pull request has an empty description and no template exists", async () => {
		const report = vi.fn();

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body: "   ",
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockRejectedValue(new Error("Not found")),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This PR's description doesn't contain any words.",
			suggestion: ["Please add at least a brief explanation of the changes."],
		});
	});

	it("reports when the pull request only contains template content", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease describe your changes";
		const body = "## Description\n\nPlease describe your changes";

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"This PR's description doesn't contain any content beyond the template.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("does not report when the pull request has content without a template", async () => {
		const report = vi.fn();

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body: "This is a description of my changes",
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockRejectedValue(new Error("Not found")),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the pull request has content beyond the template", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease describe your changes";
		const body =
			"## Description\n\nI fixed the login issue by updating the auth logic";

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("correctly handles special characters in PR description and template", async () => {
		const report = vi.fn();
		const templateContent =
			"## Description\n\nPlease describe your changes! (required)";
		const body =
			"## Description\n\nFixed bug #123 & improved performance by 50%";

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("handles case insensitivity correctly", async () => {
		const report = vi.fn();
		const templateContent = "## Description\n\nPlease DESCRIBE your changes";
		const body = "## Description\n\nPlease describe YOUR changes";

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary:
				"This PR's description doesn't contain any content beyond the template.",
			suggestion: [
				"Please add a description explaining the purpose and changes in this PR.",
			],
		});
	});

	it("correctly handles non-latin characters", async () => {
		const report = vi.fn();
		// cspell:disable-next-line
		const templateContent = "## Description\n\nОпишите ваши изменения";
		// cspell:disable-next-line
		const body = "## Description\n\nИсправлена ошибка аутентификации";

		await testRule(
			prBodyNotEmpty,
			{
				data: {
					body,
				},
				type: "pull_request",
			},
			{
				octokit: {
					rest: {
						repos: {
							// @ts-expect-error -- this should be fully partial
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from(templateContent).toString("base64"),
									type: "file",
								},
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});
});
