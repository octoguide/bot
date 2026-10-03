import type { Octokit } from "octokit";

import { describe, expect, it, type Mock, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { prLinkedIssue } from "./prLinkedIssue.js";

describe(prLinkedIssue.about.name, () => {
	it("does not report when the pull request has a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					head: {
						ref: "patch-1",
					},
				},
				number: 2,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [{ number: 1 }],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).not.toHaveBeenCalled();
	});

	it("reports when the pull request does not have a closing issue reference", async () => {
		const report = vi.fn();

		await testRule(
			prLinkedIssue,
			{
				data: {
					base: {
						ref: "main",
						repo: { default_branch: "main" },
					},
					head: {
						ref: "main",
					},
				},
				number: 2,
				type: "pull_request",
			},
			{
				octokit: {
					graphql: vi.fn().mockResolvedValue({
						repository: {
							pullRequest: {
								closingIssuesReferences: {
									nodes: [],
								},
							},
						},
					}) as unknown as Octokit["graphql"],
				},
				report,
			},
		);

		expect(report).toHaveBeenCalledWith({
			primary: "This pull request is not linked as closing any issues.",
			suggestion: [
				"To resolve this report:",
				"* If this is a straightforward documentation change that doesn't need an issue, you can ignore this report",
				"* If there is a backing issue, add a 'fixes #...' link to the pull request body",
				"* If addressing a Dependabot alert, add a link to the alert (e.g., https://github.com/owner/repo/security/dependabot/123)",
				"* Otherwise, file an issue explaining what you'd like to happen",
			],
		});
	});

	describe("Dependabot alert links", () => {
		const createRequestError = (status: number, message: string) =>
			Object.assign(
				new Error(
					`${message} - https://docs.github.com/rest/dependabot/alerts#get-a-dependabot-alert`,
				),
				{ status },
			);

		const testDependabotAlertLinks = async (body: string, getAlert: Mock) => {
			const report = vi.fn();

			await testRule(
				prLinkedIssue,
				{
					data: {
						base: {
							ref: "main",
							repo: { default_branch: "main" },
						},
						body,
						head: {
							ref: "dependabot-patch",
						},
					},
					number: 3,
					type: "pull_request",
				},
				{
					octokit: {
						graphql: vi.fn().mockResolvedValue({
							repository: {
								pullRequest: {
									closingIssuesReferences: {
										nodes: [],
									},
								},
							},
						}) as unknown as Octokit["graphql"],
						rest: { dependabot: { getAlert } },
					},
					report,
				},
			);

			return report;
		};

		it("does not report when the body links to an existing Dependabot alert", async () => {
			const getAlert = vi.fn().mockResolvedValue({ data: {} });

			const report = await testDependabotAlertLinks(
				"fixes: https://github.com/OctoGuide/bot/security/dependabot/85",
				getAlert,
			);

			expect(getAlert).toHaveBeenCalledWith({
				alert_number: 85,
				owner: "OctoGuide",
				repo: "bot",
			});
			expect(report).not.toHaveBeenCalled();
		});

		it.each([
			createRequestError(403, "Resource not accessible by integration"),
			createRequestError(
				403,
				"Dependabot alerts are disabled for this repository.",
			),
			createRequestError(404, "Not Found"),
			createRequestError(500, "Server Error"),
			new Error("Network Error"),
		])(
			"does not report when looking up a Dependabot alert in another repository fails with: %s",
			async (error) => {
				const getAlert = vi.fn().mockRejectedValue(error);

				const report = await testDependabotAlertLinks(
					"fixes: https://github.com/owner/repo/security/dependabot/123",
					getAlert,
				);

				expect(report).not.toHaveBeenCalled();
			},
		);

		it("reports when GitHub says no Dependabot alert was found", async () => {
			const getAlert = vi
				.fn()
				.mockRejectedValue(
					createRequestError(404, "No alert found for alert number 123"),
				);

			const report = await testDependabotAlertLinks(
				"fixes: https://github.com/owner/repo/security/dependabot/123",
				getAlert,
			);

			expect(report).toHaveBeenCalledWith({
				primary: "This pull request is not linked as closing any issues.",
				secondary: [
					"The linked Dependabot alert, https://github.com/owner/repo/security/dependabot/123, could not be found.",
				],
				suggestion: [
					"To resolve this report:",
					"* If this is a straightforward documentation change that doesn't need an issue, you can ignore this report",
					"* If there is a backing issue, add a 'fixes #...' link to the pull request body",
					"* If addressing a Dependabot alert, add a link to the alert (e.g., https://github.com/owner/repo/security/dependabot/123)",
					"* Otherwise, file an issue explaining what you'd like to happen",
				],
			});
		});

		it("reports when a Dependabot alert in this repository is not found", async () => {
			const getAlert = vi
				.fn()
				.mockRejectedValue(createRequestError(404, "Not Found"));

			const report = await testDependabotAlertLinks(
				"fixes: https://github.com/Test-Owner/test-repo/security/dependabot/123",
				getAlert,
			);

			expect(report).toHaveBeenCalledOnce();
		});

		it("does not report when a link to a missing Dependabot alert is followed by a link to an existing one", async () => {
			const getAlert = vi
				.fn()
				.mockRejectedValueOnce(
					createRequestError(404, "No alert found for alert number 999"),
				)
				.mockResolvedValueOnce({ data: {} });

			const report = await testDependabotAlertLinks(
				[
					"fixes: https://github.com/OctoGuide/bot/security/dependabot/999",
					"fixes: https://github.com/OctoGuide/bot/security/dependabot/85",
				].join("\n"),
				getAlert,
			);

			expect(getAlert).toHaveBeenCalledTimes(2);
			expect(getAlert).toHaveBeenLastCalledWith({
				alert_number: 85,
				owner: "OctoGuide",
				repo: "bot",
			});
			expect(report).not.toHaveBeenCalled();
		});

		it("reports each linked Dependabot alert when none are found", async () => {
			const getAlert = vi
				.fn()
				.mockRejectedValue(
					createRequestError(404, "No alert found for alert number 1"),
				);

			const report = await testDependabotAlertLinks(
				[
					"fixes: https://github.com/owner/repo/security/dependabot/1",
					"fixes: https://github.com/owner/repo/security/dependabot/2",
					"fixes: https://github.com/owner/repo/security/dependabot/1",
				].join("\n"),
				getAlert,
			);

			expect(getAlert).toHaveBeenCalledTimes(2);
			expect(report).toHaveBeenCalledWith(
				expect.objectContaining({
					secondary: [
						"The linked Dependabot alert, https://github.com/owner/repo/security/dependabot/1, could not be found.",
						"The linked Dependabot alert, https://github.com/owner/repo/security/dependabot/2, could not be found.",
					],
				}),
			);
		});
	});
});
