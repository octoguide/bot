# `pr-linked-issue`

> Tasks lists from the pull request template should be [x] filled out.

> Included in configs: ✅ recommended, 🔒 strict

This repository provides a set of tasks that pull request authors are expected to complete.
Those tasks should be marked as completed with a `[x]` in the pull request description.

Repositories often include a template file for pull requests, commonly `.github/PULL_REQUEST_TEMPLATE.md`.
Contributors are expected to fill out that template file for their pull request descriptions.
Template files with `- [ ]` task lists are generally expected to `[x]` fill out every item in the list to confirm they've taken that step.

```md
- [x] Added tests
```

## Optional Task Lists

GitHub-flavored Markdown does not provide a way to indicate which task list items are optional or required.
This rule cannot statically determine which tasks must have a `[x]`.

If you don't believe a task needs to be completed, consider marking the task's text with `~~` strikethrough and explaining why.
For example:

```md
- [x] ~~Added tests~~ Docs-only change
```

## See More

- [GitHub Docs: About issue and pull request templates](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates)
- [GitHub Docs: About task lists](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/about-task-lists)
- [Rule source](../../src/rules/prTaskCompletion.ts)
