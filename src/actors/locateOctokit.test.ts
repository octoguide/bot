import { Octokit } from "octokit";
import { describe, expect, it, vi } from "vitest";

import { testLocator } from "../tests/testLocator.js";
import { locateOctokit } from "./locateOctokit.js";

function createTestOctokit(baseUrl?: string) {
	const fetch =
		vi.fn<(url: string, options: { body?: string }) => Promise<Response>>();

	fetch.mockResolvedValue(
		new Response(JSON.stringify({ data: {} }), {
			headers: { "content-type": "application/json" },
			status: 200,
		}),
	);

	const octokit = new Octokit({
		auth: "test-token",
		baseUrl,
		request: { fetch },
	});

	locateOctokit(octokit, testLocator);

	return {
		octokit,
		requestedBody: () =>
			JSON.parse(fetch.mock.calls[0][1].body ?? "{}") as Record<
				string,
				unknown
			>,
		requestedUrl: () => fetch.mock.calls[0][0],
	};
}

describe(locateOctokit, () => {
	it("adds owner and repo to a route declaring their placeholders", async () => {
		const { octokit, requestedUrl } = createTestOctokit();

		await octokit.rest.issues.get({ issue_number: 1 });

		expect(requestedUrl()).toBe(
			"https://api.github.com/repos/test-owner/test-repo/issues/1",
		);
	});

	it("keeps an explicit owner and repo on a route declaring their placeholders", async () => {
		const { octokit, requestedUrl } = createTestOctokit();

		await octokit.rest.issues.get({
			issue_number: 1,
			owner: "other-owner",
			repo: "other-repo",
		});

		expect(requestedUrl()).toBe(
			"https://api.github.com/repos/other-owner/other-repo/issues/1",
		);
	});

	it("does not add owner and repo to a route omitting their placeholders", async () => {
		const { octokit, requestedUrl } = createTestOctokit();

		await octokit.rest.users.getAuthenticated();

		expect(requestedUrl()).toBe("https://api.github.com/user");
	});

	it("adds owner and repo variables to a GraphQL query", async () => {
		const { octokit, requestedBody } = createTestOctokit();

		await octokit.graphql("query { viewer { login } }", { first: 10 });

		expect(requestedBody().variables).toEqual({
			first: 10,
			owner: testLocator.owner,
			repo: testLocator.repository,
		});
	});

	it("keeps explicit owner and repo variables on a GraphQL query", async () => {
		const { octokit, requestedBody } = createTestOctokit();

		await octokit.graphql("query { viewer { login } }", {
			owner: "other-owner",
			repo: "other-repo",
		});

		expect(requestedBody().variables).toEqual({
			owner: "other-owner",
			repo: "other-repo",
		});
	});

	it("adds owner and repo variables to a GraphQL query on a custom host", async () => {
		const { octokit, requestedBody, requestedUrl } = createTestOctokit(
			"https://github.example.com/api/v3",
		);

		await octokit.graphql("query { viewer { login } }");

		expect(requestedUrl()).toBe("https://github.example.com/api/graphql");
		expect(requestedBody().variables).toEqual({
			owner: testLocator.owner,
			repo: testLocator.repository,
		});
	});
});
