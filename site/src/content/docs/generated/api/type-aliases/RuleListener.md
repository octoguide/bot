---
editUrl: false
next: false
prev: false
title: "RuleListener"
---

> **RuleListener**\<`Target`\> = (`context`, `entity`) => `Promise`\<`void`\> \| `void`

Rule property called if the rule is run on the corresponding entity type.

## Type Parameters

### Target

`Target` *extends* [`Entity`](/generated/api/type-aliases/entity/)

Type of entity this function may be called on.

## Parameters

### context

[`RuleContext`](/generated/api/interfaces/rulecontext/)

### entity

`Target`

## Returns

`Promise`\<`void`\> \| `void`
