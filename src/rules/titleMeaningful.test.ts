import type { Octokit } from "octokit";

import { describe, expect, it, vi } from "vitest";

import { testRule } from "../tests/testRule.js";
import { titleMeaningful } from "./titleMeaningful.js";

function createGraphql(templateContents: string[]) {
	return vi.fn().mockResolvedValue({
		repository: {
			templateDir: {
				entries: templateContents.map((text, index) => ({
					name: `0${index}-template.yml`,
					object: { text },
					type: "blob",
				})),
			},
		},
	}) as unknown as Octokit["graphql"];
}

const bugTemplate = `name: 🐛 Bug\ntitle: "🐛 Bug: <short description of the bug>"\nbody: []\n`;

const featureTemplate = `name: 🚀 Feature\ntitle: "🚀 Feature: <short description of the feature>"\nbody: []\n`;

const ideaTemplate = `title: "💡 Idea: <short description of the idea>"\nbody: []\n`;

describe(titleMeaningful.about.name, () => {
	describe("issue", () => {
		it("does not report when the title describes the issue", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{
					data: { title: "🐛 Bug: Reports are posted twice on re-runs" },
					type: "issue",
				},
				{
					octokit: { graphql: createGraphql([bugTemplate, featureTemplate]) },
					report,
				},
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("does not report when there are no issue templates", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{
					data: { title: "Reports are posted twice on re-runs" },
					type: "issue",
				},
				{ octokit: { graphql: createGraphql([]) }, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports when the title is identical to its template's title", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{
					data: { title: "🐛 Bug: <short description of the bug>" },
					type: "issue",
				},
				{
					octokit: { graphql: createGraphql([bugTemplate, featureTemplate]) },
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This issue's title still looks like the default title from its template.`,
				secondary: ["> 🐛 Bug: <short description of the bug>"],
				suggestion: [
					`To resolve this report, edit the title to describe this specific issue.`,
				],
			});
		});

		it("reports when the title is its template's title cut down to the prefix", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "🐛 Bug:" }, type: "issue" },
				{
					octokit: { graphql: createGraphql([bugTemplate, featureTemplate]) },
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This issue's title still looks like the default title from its template.`,
				secondary: ["> 🐛 Bug: <short description of the bug>"],
				suggestion: [
					`To resolve this report, edit the title to describe this specific issue.`,
				],
			});
		});

		it("reports when the title adds no words beyond its template's title", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "🐛 Bug: the bug" }, type: "issue" },
				{
					octokit: { graphql: createGraphql([bugTemplate, featureTemplate]) },
					report,
				},
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This issue's title doesn't contain any words describing what it's about.`,
				secondary: ["> 🐛 Bug: the bug"],
				suggestion: [
					`To resolve this report, edit the title to summarize what this issue is about.`,
				],
			});
		});

		it("reports when the title is only the repository name", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "test repo" }, type: "issue" },
				{ octokit: { graphql: createGraphql([]) }, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This issue's title doesn't contain any words describing what it's about.`,
				secondary: ["> test repo"],
				suggestion: [
					`To resolve this report, edit the title to summarize what this issue is about.`,
				],
			});
		});

		it("does not report when the title is only whitespace", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "   " }, type: "issue" },
				{ octokit: { graphql: createGraphql([]) }, report },
			);

			expect(report).not.toHaveBeenCalled();
		});
	});

	describe("pullRequest", () => {
		it("does not report when the title describes the pull request", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{
					data: { title: "fix: stop posting reports twice on re-runs" },
					type: "pull_request",
				},
				{ report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports when the title adds no words beyond the repository name", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "test-repo" }, type: "pull_request" },
				{ report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This PR's title doesn't contain any words describing what it's about.`,
				secondary: ["> test-repo"],
				suggestion: [
					`To resolve this report, edit the title to summarize what this PR is about.`,
				],
			});
		});
	});
	describe("discussion", () => {
		it("does not report when the title describes the discussion", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{
					data: { title: "💡 Idea: report on stale branches" },
					type: "discussion",
				},
				{ octokit: { graphql: createGraphql([ideaTemplate]) }, report },
			);

			expect(report).not.toHaveBeenCalled();
		});

		it("reports when the title is still its category form's title", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "💡 Idea:" }, type: "discussion" },
				{ octokit: { graphql: createGraphql([ideaTemplate]) }, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This discussion's title still looks like the default title from its template.`,
				secondary: ["> 💡 Idea: <short description of the idea>"],
				suggestion: [
					`To resolve this report, edit the title to describe this specific discussion.`,
				],
			});
		});

		it("reports when the title adds no words beyond the repository name", async () => {
			const report = vi.fn();

			await testRule(
				titleMeaningful,
				{ data: { title: "test-repo" }, type: "discussion" },
				{ octokit: { graphql: createGraphql([]) }, report },
			);

			expect(report).toHaveBeenCalledWith({
				primary: `This discussion's title doesn't contain any words describing what it's about.`,
				secondary: ["> test-repo"],
				suggestion: [
					`To resolve this report, edit the title to summarize what this discussion is about.`,
				],
			});
		});
	});
});
