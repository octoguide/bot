import type * as github from "@actions/github";

import { beforeEach, describe, expect, it, vi } from "vitest";

import type { CommentData } from "../types/entities.js";

import { RESOLVED_BY_OCTOGUIDE } from "../constants.js";
import { createCommentIdentifier } from "./comments/createCommentIdentifier.js";
import { runOctoGuideAction } from "./runOctoGuideAction.js";

const ISSUE_URL = "https://github.com/owner/repo/issues/1";
const PULL_REQUEST_URL = "https://github.com/owner/repo/pull/2";

const mockCore = {
	debug: vi.fn(),
	getInput: vi.fn(),
	info: vi.fn(),
	isDebug: vi.fn(),
	setFailed: vi.fn(),
	summary: {
		addHeading: vi.fn(),
		addRaw: vi.fn(),
		addSeparator: vi.fn(),
		write: vi.fn(),
	},
	warning: vi.fn(),
};

vi.mock("@actions/core", () => ({
	get debug() {
		return mockCore.debug;
	},
	get getInput() {
		return mockCore.getInput;
	},
	get info() {
		return mockCore.info;
	},
	get isDebug() {
		return mockCore.isDebug;
	},
	get setFailed() {
		return mockCore.setFailed;
	},
	get summary() {
		return mockCore.summary;
	},
	get warning() {
		return mockCore.warning;
	},
}));

const mockCreateActor = vi.fn();

vi.mock("../actors/createActor.js", () => ({
	get createActor() {
		return mockCreateActor;
	},
}));

const author = { login: "author", type: "User" };
const codeRabbit = { login: "coderabbitai[bot]", type: "Bot" };
const maintainer = { login: "maintainer", type: "User" };
const owner = { login: "owner", type: "User" };
const renovate = { login: "renovate[bot]", type: "Bot" };

const noOutputs = {
	closeEntity: [],
	createComment: [],
	setFailed: [],
	updateComment: [],
};

const defaultInputs = {
	"github-token": "mock-token",
	"include-associations": "FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR",
};

const template = [
	"## PR Checklist",
	"",
	"- [ ] Addresses an existing open issue: fixes #000",
	"- [ ] Steps in CONTRIBUTING.md were taken",
	"",
	"## Overview",
].join("\n");

const completedBody = [
	"## PR Checklist",
	"",
	"- [x] Addresses an existing open issue: fixes #1",
	"- [x] Steps in CONTRIBUTING.md were taken",
	"",
	"## Overview",
	"",
	"Adds the thing.",
].join("\n");

const incompleteBody = completedBody.replace("- [x] Steps", "- [ ] Steps");

function createContext(payload: typeof github.context.payload) {
	return {
		eventName: "pull_request_target",
		payload: { action: "edited", ...payload },
		repo: { owner: "owner", repo: "repo" },
	} satisfies Partial<typeof github.context> as typeof github.context;
}

function createExistingComment(url: string) {
	return {
		body: `👋 Hi @author, thanks for the pull request! ...\n\n${createCommentIdentifier(url)}`,
		html_url: `${url}#issuecomment-50`,
		id: 50,
		node_id: "IC_50",
	};
}

function createIssue(overrides: Record<string, unknown> = {}) {
	return {
		author_association: "CONTRIBUTOR",
		body: "The thing should be added.",
		html_url: ISSUE_URL,
		number: 1,
		title: "Add the thing",
		user: author,
		...overrides,
	};
}

function createMockActor(comments: Partial<CommentData>[]) {
	return {
		closeEntity: vi.fn(),
		createComment: vi.fn().mockResolvedValue(`${ISSUE_URL}#issuecomment-99`),
		getData: vi.fn(),
		listComments: vi.fn().mockResolvedValue(comments),
		metadata: {},
		minimizeComment: vi.fn().mockResolvedValue(true),
		unminimizeComment: vi.fn().mockResolvedValue(true),
		updateComment: vi.fn(),
	};
}

function createOctokit(prTemplate: string | undefined) {
	return {
		graphql: vi.fn((query: string) =>
			Promise.resolve(
				query.includes("closingIssuesReferences")
					? {
							repository: {
								pullRequest: {
									closingIssuesReferences: { nodes: [{ number: 1 }] },
								},
							},
						}
					: {
							repository: prTemplate ? { file0: { text: prTemplate } } : null,
						},
			),
		),
		rest: {
			repos: {
				get: vi.fn().mockResolvedValue({ data: { default_branch: "main" } }),
			},
		},
	};
}

function createPullRequest(overrides: Record<string, unknown> = {}) {
	return {
		author_association: "FIRST_TIME_CONTRIBUTOR",
		body: completedBody,
		head: { ref: "add-the-thing" },
		html_url: PULL_REQUEST_URL,
		labels: [],
		number: 2,
		state: "open",
		title: "feat: add the thing",
		user: author,
		...overrides,
	};
}

function getCreatedComment(actor: ReturnType<typeof createMockActor>) {
	expect(actor.createComment).toHaveBeenCalledTimes(1);
	return (actor.createComment.mock.calls[0] as [string])[0];
}

function getOutputs(actor: ReturnType<typeof createMockActor>) {
	return {
		closeEntity: actor.closeEntity.mock.calls,
		createComment: actor.createComment.mock.calls,
		setFailed: mockCore.setFailed.mock.calls,
		updateComment: actor.updateComment.mock.calls,
	};
}

function getUpdatedComment(actor: ReturnType<typeof createMockActor>) {
	expect(actor.updateComment).toHaveBeenCalledTimes(1);
	return (actor.updateComment.mock.calls[0] as [number, string])[1];
}

function setUp({
	comments = [],
	inputs,
	prTemplate,
}: {
	comments?: Partial<CommentData>[];
	inputs?: Record<string, string>;
	prTemplate?: string;
} = {}) {
	const allInputs: Record<string, string> = { ...defaultInputs, ...inputs };
	mockCore.getInput.mockImplementation((name: string) => allInputs[name] ?? "");

	const actor = createMockActor(comments);
	const octokit = createOctokit(prTemplate);
	mockCreateActor.mockResolvedValue({
		actor,
		locator: { owner: "owner", repository: "repo" },
		octokit,
	});

	return { actor, octokit };
}

describe("runOctoGuideAction on edits by other users", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		vi.stubGlobal("console", { ...console, log: vi.fn() });
	});

	describe("a maintainer's retitle that introduces a report", () => {
		const context = createContext({
			changes: { title: { from: "fix: fill in suggestions TODO yaml" } },
			pull_request: createPullRequest({
				author_association: "CONTRIBUTOR",
				title: "fix(yaml) [emptyMappingKeys]: fill in suggestions TODO yaml",
			}),
			sender: maintainer,
		});

		it("mentions the maintainer when the rule includes them", async () => {
			const { actor } = setUp({
				inputs: {
					config: "strict",
					"include-associations":
						"FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR,COLLABORATOR,MEMBER",
				},
			});

			await runOctoGuideAction(context);

			const body = getCreatedComment(actor);
			expect(body).toMatch(
				/^👋 Hi @maintainer, thanks for the pull request! A scan flagged a concern/,
			);
			expect(body).toContain("pr-title-conventional");
			expect(body).not.toContain("@author");
			expect(mockCore.setFailed).toHaveBeenCalled();
		});

		it("does not report when the rule excludes the maintainer", async () => {
			const { actor } = setUp({ inputs: { config: "strict" } });

			await runOctoGuideAction(context);

			expect(getOutputs(actor)).toEqual(noOutputs);
		});
	});

	it("keeps mentioning the author for an existing report when a maintainer fixes a typo in the title", async () => {
		const { actor } = setUp({
			comments: [createExistingComment(PULL_REQUEST_URL)],
			prTemplate: template,
		});

		await runOctoGuideAction(
			createContext({
				changes: { title: { from: "feat: add teh thing" } },
				pull_request: createPullRequest({ body: incompleteBody }),
				sender: maintainer,
			}),
		);

		const body = getUpdatedComment(actor);
		expect(body).toMatch(/^👋 Hi @author, thanks for the pull request!/);
		expect(body).toContain("pr-task-completion");
		expect(body).toContain("> - [ ] Steps in CONTRIBUTING.md were taken");
		expect(body).not.toContain("@maintainer");
		expect(actor.createComment).not.toHaveBeenCalled();
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("resolves the existing comment when a maintainer's edit fixes the only report", async () => {
		const { actor } = setUp({
			comments: [createExistingComment(PULL_REQUEST_URL)],
		});

		await runOctoGuideAction(
			createContext({
				changes: {
					body: { from: "Adds the thing.\n\n![](screenshot.png)" },
				},
				pull_request: createPullRequest({
					body: "Adds the thing.\n\n![Screenshot of the thing](screenshot.png)",
				}),
				sender: maintainer,
			}),
		);

		expect(getUpdatedComment(actor)).toContain(RESOLVED_BY_OCTOGUIDE);
		expect(actor.minimizeComment).toHaveBeenCalledWith("IC_50");
		expect(actor.createComment).not.toHaveBeenCalled();
		expect(mockCore.setFailed).not.toHaveBeenCalled();
	});

	it("updates the existing comment for the author when a maintainer's edit fixes part of a report", async () => {
		const { actor } = setUp({
			comments: [createExistingComment(PULL_REQUEST_URL)],
			prTemplate: template,
		});

		await runOctoGuideAction(
			createContext({
				changes: {
					body: {
						from: incompleteBody.replace("- [x] Addresses", "- [ ] Addresses"),
					},
				},
				pull_request: createPullRequest({ body: incompleteBody }),
				sender: maintainer,
			}),
		);

		const body = getUpdatedComment(actor);
		expect(body).toMatch(/^👋 Hi @author, thanks for the pull request!/);
		expect(body).toContain("> - [ ] Steps in CONTRIBUTING.md were taken");
		expect(body).not.toContain("Addresses an existing open issue");
		expect(body).not.toContain("@maintainer");
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it("mentions both the author and the maintainer when each caused a report", async () => {
		const { actor } = setUp({ prTemplate: template });

		await runOctoGuideAction(
			createContext({
				changes: { body: { from: incompleteBody } },
				pull_request: createPullRequest({
					body: `${incompleteBody}\n\n![](screenshot.png)`,
				}),
				sender: maintainer,
			}),
		);

		const body = getCreatedComment(actor);
		expect(body).toMatch(
			/^👋 Hi @author and @maintainer, thanks for the pull request! A scan flagged some concerns/,
		);
		expect(body).toContain("pr-task-completion");
		expect(body).toContain("text-image-alt-text");
	});

	it("does not report when a bot included by include-bots appends to the body of a collaborator's pull request", async () => {
		const { actor } = setUp({
			inputs: { "include-bots": "true" },
			prTemplate: template,
		});

		await runOctoGuideAction(
			createContext({
				changes: { body: { from: incompleteBody } },
				pull_request: createPullRequest({
					author_association: "COLLABORATOR",
					body: [
						incompleteBody,
						"## Summary by CodeRabbit",
						"* **New Features**\n  * Added the thing.",
					].join("\n\n"),
				}),
				sender: codeRabbit,
			}),
		);

		expect(getOutputs(actor)).toEqual(noOutputs);
	});

	it("mentions a bot included by include-bots when its edit introduces a report", async () => {
		const { actor } = setUp({ inputs: { "include-bots": "true" } });

		await runOctoGuideAction(
			createContext({
				changes: { body: { from: completedBody } },
				pull_request: createPullRequest({
					body: `${completedBody}\n\n## Summary by CodeRabbit\n\n![](diagram.png)`,
				}),
				sender: codeRabbit,
			}),
		);

		const body = getCreatedComment(actor);
		expect(body).toMatch(/^👋 Hi @coderabbitai\[bot\], /);
		expect(body).toContain("text-image-alt-text");
	});

	it("still closes a first-timer's pull request labeled as AI slop when an excluded maintainer retitles it", async () => {
		const { actor } = setUp();

		await runOctoGuideAction(
			createContext({
				changes: { title: { from: "feat: add teh thing" } },
				pull_request: createPullRequest({
					author_association: "FIRST_TIMER",
					labels: [{ name: "ai-slop" }],
				}),
				sender: maintainer,
			}),
		);

		const body = getCreatedComment(actor);
		expect(body).toMatch(/^👋 Hi @author, /);
		expect(body).toContain("pr-automation-detected");
		expect(actor.closeEntity).toHaveBeenCalled();
		expect(mockCore.setFailed).toHaveBeenCalled();
	});

	it.each([maintainer, owner])(
		"does not run rules that exclude a bot's pull request when $login ticks one of its checkboxes",
		async (sender) => {
			const { actor, octokit } = setUp({
				inputs: {
					"include-associations":
						"FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR,COLLABORATOR,MEMBER,OWNER",
				},
				prTemplate: template,
			});
			const body = [
				"This PR contains the following updates: ![](badge.svg)",
				"- [x] <!-- rebase-check -->If you want to rebase/retry this PR, check this box",
			].join("\n\n");

			await runOctoGuideAction(
				createContext({
					changes: { body: { from: body.replace("- [x]", "- [ ]") } },
					pull_request: createPullRequest({
						author_association: "CONTRIBUTOR",
						body,
						head: { ref: "renovate/the-thing-1.x" },
						title: "chore(deps): update the thing to v1.2.3",
						user: renovate,
					}),
					sender,
				}),
			);

			expect(getOutputs(actor)).toEqual(noOutputs);
			expect(octokit.graphql).not.toHaveBeenCalled();
			expect(octokit.rest.repos.get).not.toHaveBeenCalled();
		},
	);

	describe("an edit that introduces a report from a rule that only includes OWNER", () => {
		const createOwnerContext = (sender: typeof owner) =>
			createContext({
				changes: { body: { from: "The thing should be added." } },
				issue: createIssue({
					body: "The thing should be added.\n\n![](screenshot.png)",
				}),
				sender,
			});

		const inputs = {
			rules: JSON.stringify({
				"text-image-alt-text": { "include-associations": ["OWNER"] },
			}),
		};

		it("mentions the repository owner when they're the editor", async () => {
			const { actor } = setUp({ inputs });

			await runOctoGuideAction(createOwnerContext(owner));

			const body = getCreatedComment(actor);
			expect(body).toMatch(/^👋 Hi @owner, thanks for the issue!/);
			expect(body).toContain("text-image-alt-text");
		});

		it("does not report when another maintainer is the editor", async () => {
			const { actor } = setUp({ inputs });

			await runOctoGuideAction(createOwnerContext(maintainer));

			expect(getOutputs(actor)).toEqual(noOutputs);
		});
	});

	it("mentions a maintainer whose edit to another user's comment introduces a report", async () => {
		const { actor } = setUp();
		const commentUrl = `${ISSUE_URL}#issuecomment-3`;

		await runOctoGuideAction(
			createContext({
				changes: { body: { from: "Here's a screenshot." } },
				comment: {
					author_association: "CONTRIBUTOR",
					body: "Here's a screenshot: ![](screenshot.png)",
					html_url: commentUrl,
					id: 3,
					user: { login: "commenter", type: "User" },
				},
				issue: createIssue(),
				sender: maintainer,
			}),
		);

		const body = getCreatedComment(actor);
		expect(body).toMatch(
			/^👋 Hi @maintainer, thanks for the \[comment\]\([^)]+issuecomment-3 /,
		);
		expect(body).toContain("text-image-alt-text");
		expect(body).not.toContain("@commenter");
		expect(body).toContain(createCommentIdentifier(commentUrl));
	});

	it("treats a change to only a pull request's base as the author's", async () => {
		const { actor } = setUp({
			inputs: { rules: JSON.stringify({ "pr-title-conventional": true }) },
		});

		await runOctoGuideAction(
			createContext({
				changes: { base: { ref: { from: "old" }, sha: { from: "abc123" } } },
				pull_request: createPullRequest({ title: "Add the thing" }),
				sender: maintainer,
			}),
		);

		const body = getCreatedComment(actor);
		expect(body).toMatch(/^👋 Hi @author, thanks for the pull request!/);
		expect(body).toContain("pr-title-conventional");
		expect(mockCreateActor).toHaveBeenCalledTimes(1);
	});
});
