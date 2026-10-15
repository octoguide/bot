/**
 * The {@link https://www.npmjs.com/package/octoguide | octoguide} package
 * to use the API is the same as the {@link https://octo.guide/cli | standalone CLI}
 * and its code is directly used by the {@link https://octo.guide/get-started#installation | GitHub Action}.
 *
 * For installation instruction see
 * {@link https://octo.guide/docs/installation | Installing the OctoGuide Package}.
 * @module
 */

export * from "./createDefineRule.ts";
export * from "./reporters/cliReporter.ts";
export * from "./reporters/markdownReporter.ts";
export * from "./runOctoGuideRules.ts";
export type { RepositoryLocator } from "./types/data.ts";
export type {
	CommentEntity,
	DiscussionEntity,
	Entity,
	IssueEntity,
	PullRequestEntity,
} from "./types/entities.ts";
export type { LocatedOctokit } from "./types/octokit.ts";
export type { RuleReport, RuleReportData } from "./types/reports.ts";
export type {
	Rule,
	RuleAbout,
	RuleContext,
	RuleListener,
	RuleOptions,
	RuleOptionsRaw,
	RuleReporter,
} from "./types/rules.ts";
export type { Settings } from "./types/settings.ts";
