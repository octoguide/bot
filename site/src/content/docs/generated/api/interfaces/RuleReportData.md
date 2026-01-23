---
editUrl: false
next: false
prev: false
title: "RuleReportData"
---

Report data for a specific [RuleReport](/generated/api/interfaces/rulereport/) violation.

## Properties

### primary

> **primary**: `string`

Single sentence description of the reported violation.

#### Example

```ts
"The following image is missing alt text:"
```

***

### secondary?

> `optional` **secondary**: `string`[]

Any additional sentences detailing the violation.

#### Example

```ts
["> [](img.jpg)"]
```

***

### suggestion

> **suggestion**: `string`[]

Steps the user can take to resolve the violation.

#### Example

```ts
"To resolve this report, add descriptive alt text to the image."
```
