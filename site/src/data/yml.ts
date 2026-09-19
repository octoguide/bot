import { version } from "./package.js";

const atVersion = `@${version}`;

export const getStartedBase = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}

name: OctoGuide

on:
  discussion:
    types: [created, edited]
  discussion_comment:
    types: [created, deleted, edited]
  issue_comment:
    types: [created, deleted, edited]
  issues:
    types: [edited, opened]
  pull_request_review_comment:
    types: [created, deleted, edited]
  pull_request_target:
    types: [edited, opened]

permissions:
  discussions: write
  issues: write
  pull-requests: write`;

export const getStartedStrict = `
jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          config: strict
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedNone = `
jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          config: none
          github-token: \${{ secrets.GITHUB_TOKEN }}
          pr-linked-issue: "true"`;

export const getStartedHeader = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          comment-header: "Hey! You! Listen! This is a bot message from Octoguide! 🐙"
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedFooter = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot@v0
        with:
+          comment-footer: "🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices."
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedRuleDisable = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          rules: |
+            {
+              "comment-meaningful": false
+            }`;

export const getStartedRuleEnable = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          config: recommended
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          rules: |
+            {
+              "pr-title-conventional": true
+            }`;

export const getStartedRuleNone = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          config: none
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          rules: |
+            {
+              "comment-meaningful": true,
+              "pr-linked-issue": true,
+              "text-image-alt-text": true,
+            }`;

export const getStartedRuleOptions = `jobs:
  octoguide:

    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          rules: |
+            {
+              "text-image-alt-text": {
+                "include-associations": ["FIRST_TIMER", "FIRST_TIME_CONTRIBUTOR"]
+              }
+            }`;

export const getStartedIncludeBots = `jobs:
  octoguide:

    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
+          include-bots: "true"
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedIncludeAssociationsDefault = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          include-associations: "FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR"`;

export const getStartedIncludeCollaborators = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          include-associations: "FIRST_TIMER,FIRST_TIME_CONTRIBUTOR,CONTRIBUTOR,COLLABORATOR,MEMBER,OWNER"`;

export const getStartedIncludeFirstTimers = `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          include-associations: "FIRST_TIMER,FIRST_TIME_CONTRIBUTOR"`;

export const getRuleDefaultOptions = (
	ruleName: string,
	defaultOptions: object,
) => {
	const rules = JSON.stringify({ [ruleName]: defaultOptions }, null, 2)
		.split("\n")
		.map((line) => `+            ${line}`)
		.join("\n");

	return `jobs:
  octoguide:
    runs-on: ubuntu-latest
    steps:
      - uses: OctoGuide/bot${atVersion}
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          rules: |
${rules}`;
};
