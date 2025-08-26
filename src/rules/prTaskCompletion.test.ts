import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prTaskCompletion } from "./prTaskCompletion.js";

describe(prTaskCompletion.about.name, () => {
	it("does not report when there is no PR template", async () => {
		const report = vi.fn();

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {},
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockRejectedValue(new Error("Not found")),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the PR template response has array data (simulating non-file from GraphQL)", async () => {
		const report = vi.fn();

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: {} },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: [],
							}),
						},
					},
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("does not report when the PR template response is not a file (simulating non-file from GraphQL)", async () => {
		const report = vi.fn();

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { type: "dir" } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									type: "dir",
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

	it("does not report when the PR template response has no tasks", async () => {
		const report = vi.fn();
		const templateContent = "Just send it.";

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { text: templateContent } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: "Just send it.",
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

	it("reports when the template has tasks and the pull request body is empty", async () => {
		const report = vi.fn();
		const templateContent = "- [ ] Task 1\n- [ ] Task 2";

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { text: templateContent } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from("- [ ] Task 1\n- [ ] Task 2").toString(
										"base64",
									),
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
				"This PR's body is empty, but there is a template with tasks to be done.",
			suggestion: [
				"Please fill out the pull request template and make sure all the tasks are `[x]` checked.",
			],
		});
	});

	it("reports when the template has tasks and the pull request body only completes one of them", async () => {
		const report = vi.fn();
		const templateContent = "- [ ] Task 1\n- [ ] Task 2";

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "- [x] Task 1\n- [ ] Task 2",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { text: templateContent } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from("- [ ] Task 1\n- [ ] Task 2").toString(
										"base64",
									),
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
				"This PR's body is missing `[x]` checks on the following tasks from the PR template.",
			secondary: ["> - [ ] Task 2"],
			suggestion: [
				"Please complete those tasks and mark the checks as `[x]` completed.",
			],
		});
	});

	it("reports when the template has tasks and the pull request body completes none of them", async () => {
		const report = vi.fn();
		const templateContent = "- [ ] Task 1\n- [ ] Task 2";

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "- [ ] Task 1\n- [ ] Task 2",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { text: templateContent } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from("- [ ] Task 1\n- [ ] Task 2").toString(
										"base64",
									),
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
				"This PR's body is missing `[x]` checks on the following tasks from the PR template.",
			secondary: ["> - [ ] Task 1", "> - [ ] Task 2"],
			suggestion: [
				"Please complete those tasks and mark the checks as `[x]` completed.",
			],
		});
	});

	it("does not report when the template has tasks and the pull request body completes all of them", async () => {
		const report = vi.fn();
		const templateContent = "- [ ] Task 1\n- [ ] Task 2";

		await testRule(
			prTaskCompletion,
			{
				data: {
					body: "- [x] Task 1\n- [x] Task 2",
				},
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: { file0: { text: templateContent } },
					}) as unknown as Octokit["graphql"],
					rest: {
						repos: {
							getContent: vi.fn().mockResolvedValueOnce({
								data: {
									content: Buffer.from("- [ ] Task 1\n- [ ] Task 2").toString(
										"base64",
									),
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
