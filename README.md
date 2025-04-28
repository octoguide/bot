<h1 align="center">OctoGuide</h1>

<p align="center">
	Helps contributors adhere to best practices for your repository on GitHub.
	🗺️
</p>

<p align="center">
	<!-- prettier-ignore-start -->
	<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
	<a href="#contributors" target="_blank"><img alt="👪 All Contributors: 1" src="https://img.shields.io/badge/%F0%9F%91%AA_all_contributors-1-21bb42.svg" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
	<!-- prettier-ignore-end -->
	<a href="https://github.com/JoshuaKGoldberg/octoguide/blob/main/.github/CODE_OF_CONDUCT.md" target="_blank"><img alt="🤝 Code of Conduct: Kept" src="https://img.shields.io/badge/%F0%9F%A4%9D_code_of_conduct-kept-21bb42" /></a>
	<a href="https://codecov.io/gh/JoshuaKGoldberg/octoguide" target="_blank"><img alt="🧪 Coverage" src="https://img.shields.io/codecov/c/github/JoshuaKGoldberg/octoguide?label=%F0%9F%A7%AA%20coverage" /></a>
	<a href="https://github.com/JoshuaKGoldberg/octoguide/blob/main/LICENSE.md" target="_blank"><img alt="📝 License: MIT" src="https://img.shields.io/badge/%F0%9F%93%9D_license-MIT-21bb42.svg" /></a>
	<a href="http://npmjs.com/package/octoguide" target="_blank"><img alt="📦 npm version" src="https://img.shields.io/npm/v/octoguide?color=21bb42&label=%F0%9F%93%A6%20npm" /></a>
	<img alt="💪 TypeScript: Strict" src="https://img.shields.io/badge/%F0%9F%92%AA_typescript-strict-21bb42.svg" />
</p>

> 🚨 **OctoGuide is very early stage and not yet fully implemented.**
> WIP!

OctoGuide checks that contributor activity on your GitHub repository aligns with common expectations of smoothly-running projects.
It will automatically post friendly comments when contributors take actions you don't want them to.
Rules are provided for common issues with comments, issues, and pull requests.

![Screenshot of colored output from OctoGuide: see docs/screenshot-text.txt for text: blue rule names, yellow high-level descriptions, gray docs links, red '3' in the last line.](docs/screenshot.png)

You can think of OctoGuide as a very friendly linter, but for online GitHub activity rather than source code.

## Usage

For now, pass a link to a comment, issue, or PR to `npx octoguide`:

```shell
npx octoguide https://github.com/JoshuaKGoldberg/octoguide-test/pull/2
```

Soon there'll be a GitHub Action that runs automatically and posts replies on GitHub.

### All Rules

Config key:

- ✅: Recommended
- 🔒: Strict

| Area     | OctoGuide Rule                                                 | Description                                 | Config |
| -------- | -------------------------------------------------------------- | ------------------------------------------- | ------ |
| Comments | [comment-meaningless](./docs/rules/comment-meaningless.md)     | should be meaningful, not just '+1' bumps   | 🔒     |
| PRs      | [pr-branch-non-default](./docs/rules/pr-branch-non-default.md) | sent from a non-default branch              | 🔒     |
| PRs      | [pr-linked-issue](./docs/rules/pr-linked-issue.md)             | must be linked to an issue (with a label)   | 🔒     |
| PRs      | [pr-task-completion](./docs/rules/pr-task-completion.md)       | all required tasks are [x] completed        | ✅     |
| PRs      | [pr-title-conventional](./docs/rules/pr-title-conventional.md) | title must be in conventional commit format | 🔒     |
| Texts    | [text-image-alt-text](./docs/rules/text-image-alt-text.md)     | images must have accessible alt text        | ✅     |

<!-- | Issues   | [issue-required-fields-content](./docs/rules/issue-required-fields-content.md) | required fields must have meaningful content | ✅     | -->

Rules are generally titled in the format of `<entity>-<area>(-<concern>)`:

- `<entity>`: one of `comment`, `issue`, `pr`, or the catch-all `text`
- `<area>`: the part of the entity being checked, such as an issue's `required-fields` or a PR's `linked-issue`
- `<concern>`: if the rule checks a specific part of the area, such as an issue's required fields `content`

## Prior Art

> 🚨 **OctoGuide is very early stage and not yet fully implemented.**
> WIP!

### Comparison with Neighboring Actions

| Area     | OctoGuide Rule                                                           | accessibility-alt-text-bot | pr-compliance-action |
| -------- | ------------------------------------------------------------------------ | -------------------------- | -------------------- |
| Comments | [comment-meaningless](./docs/comment-meaningless.md)                     |                            |                      |
| Issues   | [issue-required-fields-content](./docs/issue-required-fields-content.md) |                            |                      |
| PRs      | [pr-branch-non-default](./docs/pr-branch-non-default.md)                 |                            | ✔️                   |
| PRs      | [pr-linked-issue](./docs/pr-linked-issue.md)                             |                            | ✔️                   |
| PRs      | [pr-task-completion](./docs/pr-task-completion.md)                       |                            |                      |
| PRs      | [pr-title-conventional](./docs/pr-title-conventional.md)                 |                            | ✔️                   |
| Texts    | [text-image-alt-text](./docs/text-image-alt-text.md)                     | ✔️                         |                      |

### Other Ecosystem Approaches

- [Danger](https://danger.systems): is a much larger, more powerful system that has repositories write their rules in imperative configuration files.
  However, Danger is not made for analyzing GitHub comments or issues, only pull requests.

## Development

See [`.github/CONTRIBUTING.md`](./.github/CONTRIBUTING.md), then [`.github/DEVELOPMENT.md`](./.github/DEVELOPMENT.md).
Thanks! 🗺️

## Contributors

<!-- spellchecker: disable -->
<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="http://www.joshuakgoldberg.com"><img src="https://avatars.githubusercontent.com/u/3335181?v=4?s=100" width="100px;" alt="Josh Goldberg ✨"/><br /><sub><b>Josh Goldberg ✨</b></sub></a><br /><a href="https://github.com/JoshuaKGoldberg/OctoGuide/issues?q=author%3AJoshuaKGoldberg" title="Bug reports">🐛</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
<!-- spellchecker: enable -->

> 💝 This package was templated with [`create-typescript-app`](https://github.com/JoshuaKGoldberg/create-typescript-app) using the [Bingo framework](https://create.bingo).
