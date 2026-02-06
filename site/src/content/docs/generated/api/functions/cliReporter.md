---
editUrl: false
next: false
prev: false
title: "cliReporter"
---

> **cliReporter**(`reports`): `string`

Formats a rule report as used by the standalone CLI.

If reports is empty, it will log a happy message.
Otherwise it will pretty-print the reports, grouped by rule.

## Parameters

### reports

[`RuleReport`](/generated/api/interfaces/rulereport/)[]

Rule reports as returned by `runOctoGuideRules`

## Returns

`string`

Formatted string for CLI output

## Example

```ts
import { cliReporter, runOctoGuideRules } from "octoguide";

const { reports } = await runOctoGuideRules({
  entity: "https://github.com/OctoGuide/bot/issues/19",
});

console.log(cliReporter(reports));
```
