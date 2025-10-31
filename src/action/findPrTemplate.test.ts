import type { Octokit } from "octokit";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { RepositoryLocator } from "../types/data.js";

import { findPrTemplate, PR_TEMPLATE_PATHS } from "./findPrTemplate.js";

const PR_TEMPLATE_DIR_PATH = ".github/PULL_REQUEST_TEMPLATE";

describe("findPrTemplate", () => {
	const mockLocator: RepositoryLocator = {
		owner: "test-owner",
		repository: "test-repo",
	};
	const mockTemplate = "# PR Template\n- [ ] Task 1\n- [ ] Task 2";

	const graphqlMock = vi.fn();

	const mockOctokit = {
		graphql: graphqlMock,
	} as unknown as Octokit;

	beforeEach(() => {
		vi.resetAllMocks();
		graphqlMock.mockResolvedValue({ repository: {} });

		vi.stubGlobal("console", {
			...console,
			error: vi.fn(),
		});
	});

	PR_TEMPLATE_PATHS.forEach((path, index) => {
		it(`should find template at ${path}`, async () => {
			const mockRepoData: Record<string, unknown> = {};
			PR_TEMPLATE_PATHS.forEach((p, i) => {
				mockRepoData[`file${i}`] = p === path ? { text: mockTemplate } : null;
			});
			mockRepoData.templateDir = null;

			graphqlMock.mockResolvedValue({ repository: mockRepoData });

			const result = await findPrTemplate(mockOctokit, mockLocator);

			expect(result).toBe(mockTemplate);
			expect(graphqlMock).toHaveBeenCalledWith(
				expect.stringContaining(
					`file${index}: object(expression: "HEAD:${path}")`,
				),
				{ owner: mockLocator.owner, repo: mockLocator.repository },
			);
		});
	});

	it("should find template in .github/PULL_REQUEST_TEMPLATE directory", async () => {
		const mockRepoData: Record<string, unknown> = {};
		PR_TEMPLATE_PATHS.forEach((p, i) => {
			mockRepoData[`file${i}`] = null;
		});
		mockRepoData.templateDir = {
			entries: [
				{
					name: "template.md",
					path: `${PR_TEMPLATE_DIR_PATH}/template.md`,
					type: "blob",
				},
				{
					name: "other.txt",
					path: `${PR_TEMPLATE_DIR_PATH}/other.txt`,
					type: "blob",
				},
			],
		};

		graphqlMock
			.mockResolvedValueOnce({ repository: mockRepoData })
			.mockResolvedValueOnce({
				repository: {
					object: {
						text: mockTemplate,
					},
				},
			});

		const result = await findPrTemplate(mockOctokit, mockLocator);

		expect(result).toBe(mockTemplate);
		expect(graphqlMock).toHaveBeenCalledTimes(2);
		expect(graphqlMock).toHaveBeenNthCalledWith(
			1,
			expect.stringContaining(
				`templateDir: object(expression: "HEAD:${PR_TEMPLATE_DIR_PATH}")`,
			),
			{ owner: mockLocator.owner, repo: mockLocator.repository },
		);
		expect(graphqlMock).toHaveBeenNthCalledWith(
			2,
			expect.stringContaining("object(expression: $path)"),
			{
				owner: mockLocator.owner,
				path: `HEAD:${PR_TEMPLATE_DIR_PATH}/template.md`,
				repo: mockLocator.repository,
			},
		);
	});

	it("should return undefined if no template is found via GraphQL", async () => {
		const result = await findPrTemplate(mockOctokit, mockLocator);

		expect(result).toBeUndefined();
		expect(graphqlMock).toHaveBeenCalledTimes(1);
	});

	it("should return undefined if templateDir has no markdown files", async () => {
		const mockRepoData: Record<string, unknown> = {};
		PR_TEMPLATE_PATHS.forEach((p, i) => {
			mockRepoData[`file${i}`] = null;
		});
		mockRepoData.templateDir = {
			entries: [
				{
					name: "other.txt",
					path: `${PR_TEMPLATE_DIR_PATH}/other.txt`,
					type: "blob",
				},
			],
		};
		graphqlMock.mockResolvedValue({ repository: mockRepoData });

		const result = await findPrTemplate(mockOctokit, mockLocator);
		expect(result).toBeUndefined();
		expect(graphqlMock).toHaveBeenCalledTimes(1);
	});

	it("should handle GraphQL API errors gracefully", async () => {
		graphqlMock.mockRejectedValue(new Error("GraphQL API Error"));

		const result = await findPrTemplate(mockOctokit, mockLocator);

		expect(result).toBeUndefined();
		expect(graphqlMock).toHaveBeenCalledTimes(1);
	});

	it("should handle GraphQL API errors gracefully when fetching from directory", async () => {
		const mockRepoData: Record<string, unknown> = {};
		PR_TEMPLATE_PATHS.forEach((p, i) => {
			mockRepoData[`file${i}`] = null;
		});
		mockRepoData.templateDir = {
			entries: [
				{
					name: "template.md",
					path: `${PR_TEMPLATE_DIR_PATH}/template.md`,
					type: "blob",
				},
			],
		};
		graphqlMock
			.mockResolvedValueOnce({ repository: mockRepoData })
			.mockRejectedValueOnce(new Error("GraphQL API Error"));

		const result = await findPrTemplate(mockOctokit, mockLocator);
		expect(result).toBeUndefined();
		expect(graphqlMock).toHaveBeenCalledTimes(2);
	});
});
