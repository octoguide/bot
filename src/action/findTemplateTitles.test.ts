import type { Octokit } from "octokit";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RepositoryLocator } from "../types/data.js";

import {
	findTemplateTitles,
	ISSUE_TEMPLATE_PATHS,
	TEMPLATE_LOCATIONS,
} from "./findTemplateTitles.js";

const locator: RepositoryLocator = {
	owner: "test-owner",
	repository: "test-repo",
};

const graphqlMock = vi.fn();

const octokit = { graphql: graphqlMock } as unknown as Octokit;

describe("findTemplateTitles", () => {
	beforeEach(() => {
		vi.resetAllMocks();

		vi.stubGlobal("console", { ...console, error: vi.fn() });
	});

	it("returns an empty array when the repository doesn't exist", async () => {
		graphqlMock.mockResolvedValue({ repository: null });

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
	});

	it("returns an empty array when the GraphQL request rejects", async () => {
		graphqlMock.mockRejectedValue(new Error("Oh no!"));

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
	});

	it("returns an empty array when no templates exist", async () => {
		graphqlMock.mockResolvedValue({ repository: { templateDir: null } });

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
	});

	ISSUE_TEMPLATE_PATHS.forEach((path, index) => {
		it(`returns the front matter title of an issue template at ${path}`, async () => {
			graphqlMock.mockResolvedValue({
				repository: {
					[`file${index}`]: {
						text: `---\nname: Bug\ntitle: "🐛 Bug: "\n---\n\ntitle: not this one\n`,
					},
				},
			});

			expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([
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

	it("returns titles of issue forms in the issue template directory", async () => {
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

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([
			"🐛 Bug: ",
			"🚀 Feature:",
		]);
		expect(graphqlMock).toHaveBeenCalledWith(
			expect.stringContaining(
				`templateDir: object(expression: "HEAD:${TEMPLATE_LOCATIONS.issue.directory}")`,
			),
			{ owner: locator.owner, repo: locator.repository },
		);
	});

	it("returns titles of discussion category forms", async () => {
		graphqlMock.mockResolvedValue({
			repository: {
				templateDir: {
					entries: [
						{
							name: "ideas.yml",
							object: { text: `title: "💡 Idea: "\nlabels: []\n` },
							type: "blob",
						},
					],
				},
			},
		});

		expect(await findTemplateTitles(octokit, locator, "discussion")).toEqual([
			"💡 Idea: ",
		]);
		expect(graphqlMock).toHaveBeenCalledWith(
			expect.stringContaining(
				`templateDir: object(expression: "HEAD:${TEMPLATE_LOCATIONS.discussion.directory}")`,
			),
			{ owner: locator.owner, repo: locator.repository },
		);
	});

	it("doesn't query single-file paths for discussions", async () => {
		graphqlMock.mockResolvedValue({ repository: { templateDir: null } });

		await findTemplateTitles(octokit, locator, "discussion");

		expect(graphqlMock).toHaveBeenCalledWith(
			expect.not.stringContaining("file0:"),
			{ owner: locator.owner, repo: locator.repository },
		);
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

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
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

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
	});

	it("ignores indented title keys inside a form's body", async () => {
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

		expect(await findTemplateTitles(octokit, locator, "issue")).toEqual([]);
	});
});
