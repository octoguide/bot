import type { Octokit } from "octokit";

import { afterEach, describe, expect, it, vi } from "vitest";

import { runOctoGuideRules } from "./runOctoGuideRules.js";

const mockCore = {
	debug: vi.fn(),
	isDebug: vi.fn().mockReturnValue(false),
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get isDebug() {
		return mockCore.isDebug;
	},
}));

const mockOctokitFromAuth = vi.fn();

vi.mock("octokit-from-auth", () => ({
	get octokitFromAuth() {
		return mockOctokitFromAuth;
	},
}));

const mockCreateActor = vi.fn();

vi.mock("./actors/createActor.js", () => ({
	get createActor() {
		return mockCreateActor;
	},
}));

const mockRunRuleOnEntity = vi.fn();

vi.mock("./execution/runRuleOnEntity.js", () => ({
	get runRuleOnEntity() {
		return mockRunRuleOnEntity;
	},
}));

vi.mock("./rules/configs.js", () => ({
	configs: {
		recommended: [
			{
				about: {
					description: "Comments should be meaningful",
					name: "comment-meaningful",
				},
				comment: vi.fn(),
			},
			{
				about: {
					description: "PR bodies should be descriptive",
					name: "pr-body-descriptive",
				},
				pullRequest: vi.fn(),
			},
			{
				about: {
					description: "PRs should be sent from a non-default branch",
					name: "pr-branch-non-default",
				},
				pullRequest: vi.fn(),
			},
		],
	},
}));

vi.mock("./rules/all.js", () => ({
	allRules: [
		{
			about: {
				description: "Comments should be meaningful",
				name: "comment-meaningful",
			},
			comment: vi.fn(),
		},
		{
			about: {
				description: "PR bodies should be descriptive",
				name: "pr-body-descriptive",
			},
			pullRequest: vi.fn(),
		},
		{
			about: {
				description: "PRs should be sent from a non-default branch",
				name: "pr-branch-non-default",
			},
			pullRequest: vi.fn(),
		},
		{
			about: {
				description: "PR titles should be in conventional commit format",
				name: "pr-title-conventional",
			},
			pullRequest: vi.fn(),
		},
		{
			about: {
				description: "PRs should be linked as closing an issue",
				name: "pr-linked-issue",
			},
			pullRequest: vi.fn(),
		},
	],
}));

/**
 * Creates a mock Octokit instance with minimal required properties.
 * @returns Minimal Octokit mock that satisfies basic test requirements
 * @example
 * ```typescript
 * const octokit = createMockOctokit();
 * ```
 */
const createMockOctokit = () =>
	({
		auth: vi.fn(),
		graphql: vi.fn(),
		hook: {
			after: vi.fn(),
			before: vi.fn(),
			error: vi.fn(),
			wrap: vi.fn(),
		},
		log: {
			debug: vi.fn(),
			error: vi.fn(),
			info: vi.fn(),
			warn: vi.fn(),
		},
		request: vi.fn(),
		rest: { issues: { get: vi.fn() } },
	}) as unknown as Octokit;

describe("runOctoGuideRules", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should throw error when actor cannot be resolved", async () => {
		const mockOctokit = createMockOctokit();

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);
		mockCreateActor.mockReturnValue({ actor: undefined, locator: undefined });

		await expect(
			runOctoGuideRules({
				entity: "https://github.com/test-owner/test-repo/issues/1",
			}),
		).rejects.toThrow("Could not resolve GitHub entity actor.");

		expect(mockOctokitFromAuth).toHaveBeenCalledWith({ auth: undefined });
		expect(mockCreateActor).toHaveBeenCalledWith(
			mockOctokit,
			"https://github.com/test-owner/test-repo/issues/1",
		);
	});

	it("should use the authentication token when provided", async () => {
		const mockOctokit = createMockOctokit();

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);

		mockCreateActor.mockReturnValue({
			actor: { getData: vi.fn() },
			locator: { owner: "test-owner", repository: "test-repo" },
		});

		await runOctoGuideRules({
			auth: "test-token",
			entity: "https://github.com/test-owner/test-repo/issues/1",
		});

		expect(mockOctokitFromAuth).toHaveBeenCalledWith({ auth: "test-token" });
	});

	it("should not run any rules when all are explicitly disabled", async () => {
		const mockOctokit = createMockOctokit();
		const mockEntityData = {
			html_url: "https://github.com/test-owner/test-repo/issues/1",
			number: 1,
			title: "Test Issue",
		};
		const mockActor = {
			getData: vi.fn().mockResolvedValue(mockEntityData),
			metadata: { number: 1, type: "issue" as const },
		};

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);
		mockCreateActor.mockReturnValue({
			actor: mockActor,
			locator: { owner: "test-owner", repository: "test-repo" },
		});

		const result = await runOctoGuideRules({
			auth: "test-token",
			entity: "https://github.com/test-owner/test-repo/issues/1",
			settings: {
				config: "recommended",
				rules: {
					"comment-meaningful": false,
					"pr-body-descriptive": false,
					"pr-branch-non-default": false,
				},
			},
		});

		expect(result).toEqual({
			actor: mockActor,
			entity: {
				data: mockEntityData,
				number: 1,
				type: "issue",
			},
			reports: [],
		});

		expect(mockRunRuleOnEntity).not.toHaveBeenCalled();
	});

	it("should run all config rules when no rule settings are provided", async () => {
		const mockOctokit = createMockOctokit();
		const mockEntityData = {
			html_url: "https://github.com/test-owner/test-repo/issues/1",
			number: 1,
			title: "Test Issue",
		};
		const mockActor = {
			getData: vi.fn().mockResolvedValue(mockEntityData),
			metadata: { number: 1, type: "issue" as const },
		};

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);
		mockCreateActor.mockReturnValue({
			actor: mockActor,
			locator: { owner: "test-owner", repository: "test-repo" },
		});

		const result = await runOctoGuideRules({
			auth: "test-token",
			entity: "https://github.com/test-owner/test-repo/issues/1",
			settings: {
				config: "recommended",
			},
		});

		expect(result).toEqual({
			actor: mockActor,
			entity: {
				data: mockEntityData,
				number: 1,
				type: "issue",
			},
			reports: [],
		});

		expect(mockRunRuleOnEntity).toHaveBeenCalledTimes(3);

		const calledRules = mockRunRuleOnEntity.mock.calls.map(
			(call) => (call[1] as { about: { name: string } }).about.name,
		);
		expect(calledRules).toContain("comment-meaningful");
		expect(calledRules).toContain("pr-body-descriptive");
		expect(calledRules).toContain("pr-branch-non-default");
	});

	it("should default to recommended config when no settings are provided", async () => {
		const mockOctokit = createMockOctokit();
		const mockEntityData = {
			html_url: "https://github.com/test-owner/test-repo/issues/1",
			number: 1,
			title: "Test Issue",
		};
		const mockActor = {
			getData: vi.fn().mockResolvedValue(mockEntityData),
			metadata: { number: 1, type: "issue" as const },
		};

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);
		mockCreateActor.mockReturnValue({
			actor: mockActor,
			locator: { owner: "test-owner", repository: "test-repo" },
		});

		const result = await runOctoGuideRules({
			auth: "test-token",
			entity: "https://github.com/test-owner/test-repo/issues/1",
		});

		expect(result).toEqual({
			actor: mockActor,
			entity: {
				data: mockEntityData,
				number: 1,
				type: "issue",
			},
			reports: [],
		});

		expect(mockRunRuleOnEntity).toHaveBeenCalledTimes(3);

		const calledRules = mockRunRuleOnEntity.mock.calls.map(
			(call) => (call[1] as { about: { name: string } }).about.name,
		);
		expect(calledRules).toContain("comment-meaningful");
		expect(calledRules).toContain("pr-body-descriptive");
		expect(calledRules).toContain("pr-branch-non-default");
	});

	it("should filter rules based on config and rule overrides", async () => {
		const mockOctokit = createMockOctokit();
		const mockEntityData = {
			html_url: "https://github.com/test-owner/test-repo/pull/1",
			number: 1,
			title: "Test PR",
		};
		const mockActor = {
			getData: vi.fn().mockResolvedValue(mockEntityData),
			metadata: { number: 1, type: "pr" as const },
		};

		mockOctokitFromAuth.mockResolvedValue(mockOctokit);
		mockCreateActor.mockReturnValue({
			actor: mockActor,
			locator: { owner: "test-owner", repository: "test-repo" },
		});

		const result = await runOctoGuideRules({
			auth: "test-token",
			entity: "https://github.com/test-owner/test-repo/pull/1",
			settings: {
				config: "recommended",
				rules: {
					"non-existent-rule": true,
					"pr-branch-non-default": false,
					"pr-linked-issue": true,
					"pr-title-conventional": true,
				},
			},
		});

		expect(result).toEqual({
			actor: mockActor,
			entity: {
				data: mockEntityData,
				number: 1,
				type: "pr",
			},
			reports: [],
		});

		expect(mockRunRuleOnEntity).toHaveBeenCalledTimes(4);

		const calledRules = mockRunRuleOnEntity.mock.calls.map(
			(call) => (call[1] as { about: { name: string } }).about.name,
		);

		expect(calledRules).toContain("comment-meaningful");
		expect(calledRules).toContain("pr-body-descriptive");
		expect(calledRules).toContain("pr-linked-issue");
		expect(calledRules).toContain("pr-title-conventional");
		expect(calledRules).not.toContain("pr-branch-non-default");
		expect(calledRules).not.toContain("non-existent-rule");

		expect(mockOctokitFromAuth).toHaveBeenCalledWith({ auth: "test-token" });
		expect(mockCreateActor).toHaveBeenCalledWith(
			mockOctokit,
			"https://github.com/test-owner/test-repo/pull/1",
		);
		expect(mockActor.getData).toHaveBeenCalled();
	});
});
