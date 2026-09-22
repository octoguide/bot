import type { Octokit } from "octokit";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RepositoryLocator } from "../types/data.js";

import {
	findIssueTemplateTitles,
	ISSUE_TEMPLATE_PATHS,
} from "./findIssueTemplateTitles.js";

const locator: RepositoryLocator = {
	owner: "test-owner",
	repository: "test-repo",
};

const graphqlMock = vi.fn();

const octokit = { graphql: graphqlMock } as unknown as Octokit;

describe("findIssueTemplateTitles", () => {
	beforeEach(() => {
		vi.resetAllMocks();

		vi.stubGlobal("console", { ...console, error: vi.fn() });
	});

	it("returns an empty array when the repository doesn't exist", async () => {
		graphqlMock.mockResolvedValue({ repository: null });

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});

	it("returns an empty array when the GraphQL request rejects", async () => {
		graphqlMock.mockRejectedValue(new Error("Oh no!"));

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});

	it("returns an empty array when no templates exist", async () => {
		graphqlMock.mockResolvedValue({ repository: { templateDir: null } });

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});

	ISSUE_TEMPLATE_PATHS.forEach((path, index) => {
		it(`returns the front matter title of a template at ${path}`, async () => {
			graphqlMock.mockResolvedValue({
				repository: {
					[`file${index}`]: {
						text: `---\nname: Bug\ntitle: "🐛 Bug: "\n---\n\ntitle: not this one\n`,
					},
				},
			});

			expect(await findIssueTemplateTitles(octokit, locator)).toEqual([
				"🐛 Bug: ",
			]);
			expect(graphqlMock).toHaveBeenCalledWith(
				expect.stringContaining(
					`file${index}: object(expression: "HEAD:${path}")`,
				),
				{ owner: locator.owner, repo: locator.repository },
			);
		});
	});

	it("returns titles of issue forms in the template directory", async () => {
		graphqlMock.mockResolvedValue({
			repository: {
				templateDir: {
					entries: [
						{
							name: "01-bug.yml",
							object: { text: `name: Bug\ntitle: "🐛 Bug: "\n` },
							type: "blob",
						},
						{
							name: "02-feature.yaml",
							object: { text: `name: Feature\ntitle: 🚀 Feature:\n` },
							type: "blob",
						},
					],
				},
			},
		});

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([
			"🐛 Bug: ",
			"🚀 Feature:",
		]);
	});

	it("skips directory entries that aren't template files", async () => {
		graphqlMock.mockResolvedValue({
			repository: {
				templateDir: {
					entries: [
						{ name: "config.json", object: { text: "{}" }, type: "blob" },
						{ name: "nested", object: null, type: "tree" },
						{ name: "03-empty.yml", object: null, type: "blob" },
					],
				},
			},
		});

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});

	it("skips templates that don't declare a title", async () => {
		graphqlMock.mockResolvedValue({
			repository: {
				templateDir: {
					entries: [
						{
							name: "01-bug.yml",
							object: { text: `name: Bug\nbody:\n  - type: markdown\n` },
							type: "blob",
						},
					],
				},
			},
		});

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});

	it("ignores indented title keys inside an issue form's body", async () => {
		graphqlMock.mockResolvedValue({
			repository: {
				templateDir: {
					entries: [
						{
							name: "01-bug.yml",
							object: {
								text: `name: Bug\nbody:\n  - attributes:\n      title: Not the default title\n`,
							},
							type: "blob",
						},
					],
				},
			},
		});

		expect(await findIssueTemplateTitles(octokit, locator)).toEqual([]);
	});
});
