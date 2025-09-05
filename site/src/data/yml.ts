import { version } from "./package.js";

const atVersion = `@${version}`;

export const getStartedBase = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
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
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          config: strict
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedNone = `
jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          config: none
          github-token: \${{ secrets.GITHUB_TOKEN }}
          pr-linked-issue: "true"`;

export const getStartedHeader = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          comment-header: "Hey! You! Listen! This is a bot message from Octoguide! 🐙"
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedFooter = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide@v0
        with:
+          comment-footer: "🗺️ This message was posted automatically by [OctoGuide](https://octo.guide): a bot for GitHub repository best practices."
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedRuleDisable = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          comment-meaningful: "false"
          github-token: \${{ secrets.GITHUB_TOKEN }}`;

export const getStartedRuleEnable = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          config: recommended
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          pr-title-conventional: "true"`;

export const getStartedRuleNone = `jobs:
  octoguide:
    if: \${{ !endsWith(github.actor, '[bot]') }}
    runs-on: ubuntu-latest
    steps:
      - uses: JoshuaKGoldberg/octoguide${atVersion}
        with:
+          comment-meaningful: "true"
+          config: none
          github-token: \${{ secrets.GITHUB_TOKEN }}
+          pr-linked-issue: "true"
+          text-image-alt-text: "true"`;
