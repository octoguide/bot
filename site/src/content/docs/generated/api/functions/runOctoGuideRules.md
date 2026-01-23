---
editUrl: false
next: false
prev: false
title: "runOctoGuideRules"
---

> **runOctoGuideRules**(`options`): `Promise`\<[`RunOctoGuideRulesResult`](/generated/api/interfaces/runoctoguiderulesresult/)\>

Runs OctoGuide's rules to generate a list of reports for a GitHub entity.
The entity can be provided as either a URL string (which will be fetched from the GitHub API) or pre-existing entity data.

Takes in a single parameter of type [RunOctoGuideRulesOptions](/generated/api/interfaces/runoctoguiderulesoptions/).
Returns a [RunOctoGuideRulesResult](/generated/api/interfaces/runoctoguiderulesresult/).

## Parameters

### options

[`RunOctoGuideRulesOptions`](/generated/api/interfaces/runoctoguiderulesoptions/)

Configuration object

## Returns

`Promise`\<[`RunOctoGuideRulesResult`](/generated/api/interfaces/runoctoguiderulesresult/)\>

Promise resolving to results with actor, entity data, and rule reports

## Example

```ts
import { runOctoGuideRules } from "octoguide";

const { reports } = await runOctoGuideRules({
  entity: "https://github.com/OctoGuide/bot/issues/19",
});

console.log("Received reports:", reports);
```
