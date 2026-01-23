/**
 * The {@link https://www.npmjs.com/package/octoguide | octoguide} package
 * to use the API is the same as the {@link https://octo.guide/cli | standalone CLI}
 * and its code is directly used by the {@link https://octo.guide/get-started#installation | GitHub Action}.
 *
 * For installation instruction see
 * {@link https://octo.guide/docs/installing-octoguide-package | Installing the OctoGuide Package}.
 * @module
 */

export * from "./createDefineRule.js";
export * from "./reporters/cliReporter.js";
export * from "./reporters/markdownReporter.js";
export * from "./runOctoGuideRules.js";
export type {
	CommentEntity,
	DiscussionEntity,
	Entity,
	IssueEntity,
	PullRequestEntity,
} from "./types/entities.js";
export type { RuleReport, RuleReportData } from "./types/reports.js";
export type {
	Rule,
	RuleAbout,
	RuleContext,
	RuleListener,
	RuleReporter,
} from "./types/rules.js";
