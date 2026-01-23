---
editUrl: false
next: false
prev: false
title: "markdownReporter"
---

> **markdownReporter**(`headline`, `reports`): `string`

Formats a rule report as used by the GitHub Actions Workflow.

If reports is empty, it will return a happy message.
Otherwise it will pretty-print the reports, grouped by rule.

## Parameters

### headline

`string`

Headline text for the report (typically entity information)

### reports

[`RuleReport`](/generated/api/interfaces/rulereport/)[]

Rule reports as returned by `runOctoGuideRules`

## Returns

`string`

Formatted markdown string for GitHub comment

## Example

```ts
import { markdownReporter, runOctoGuideRules } from "octoguide";

const { entity, reports } = await runOctoGuideRules({
  entity: "https://github.com/OctoGuide/bot/issues/19",
});

console.log(markdownReporter(entity.data.html_url, reports));
```
