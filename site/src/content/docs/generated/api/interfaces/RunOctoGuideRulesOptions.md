---
editUrl: false
next: false
prev: false
title: "RunOctoGuideRulesOptions"
---

Settings for running [runOctoGuideRules](/generated/api/functions/runoctoguiderules/).
Only `entity` is required.

## Example

```ts
import { runOctoGuideRules } from "octoguide";

// Using a URL string - will fetch data from GitHub API
await runOctoGuideRules({
  auth: "ghp_...",
  entity: "https://github.com/OctoGuide/bot/issues/19",
});

// Using pre-existing Entity data - avoids API calls
const existingEntity = {
  data: { },
  number: 19,
  type: "issue",
};

await runOctoGuideRules({
  auth: "ghp_...",
  entity: existingEntity,
});
```

## Properties

### auth?

> `optional` **auth**: `string`

GitHub authentication token.
If not provided, retrieved with `get-github-auth-token`.

***

### entity

> **entity**: `string` \| [`Entity`](/generated/api/type-aliases/entity/)

GitHub entity to run rules on. Can be either:
- A string URL (e.g., `"https://github.com/owner/repo/issues/123"`) - will fetch entity data via GitHub API
- An `Entity` object with pre-fetched data - avoids additional API calls when data is already available

***

### settings?

> `optional` **settings**: `Settings`

Settings for the run, including rules to enable.
