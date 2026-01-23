---
editUrl: false
next: false
prev: false
title: "Rule"
---

Defines how to analyze entities for a single best practice.

## Type Parameters

### About

`About` *extends* [`RuleAbout`](/generated/api/interfaces/ruleabout/) = [`RuleAbout`](/generated/api/interfaces/ruleabout/)

## Properties

### about

> **about**: `About`

Metadata about the rule.

***

### comment?

> `optional` **comment**: [`RuleListener`](/generated/api/type-aliases/rulelistener/)\<[`CommentEntity`](/generated/api/interfaces/commententity/)\>

Callback to run if the entity is a comment.

***

### discussion?

> `optional` **discussion**: [`RuleListener`](/generated/api/type-aliases/rulelistener/)\<[`DiscussionEntity`](/generated/api/interfaces/discussionentity/)\>

Callback to run if the entity is a discussion.

***

### issue?

> `optional` **issue**: [`RuleListener`](/generated/api/type-aliases/rulelistener/)\<[`IssueEntity`](/generated/api/interfaces/issueentity/)\>

Callback to run if the entity is a issue.

***

### pullRequest?

> `optional` **pullRequest**: [`RuleListener`](/generated/api/type-aliases/rulelistener/)\<[`PullRequestEntity`](/generated/api/interfaces/pullrequestentity/)\>

Callback to run if the entity is a pull request.
