---
editUrl: false
next: false
prev: false
title: "RuleContext"
---

Shared context provided to rules when they run on an entity.

## Properties

### locator

> **locator**: `RepositoryLocator`

Repository location on GitHub.

***

### octokit

> **octokit**: `Octokit` & `object` & `paginateGraphQLInterface` & `Api` & `object`

Octokit instance that can send GitHub API calls.

#### Type Declaration

##### paginate

> **paginate**: `PaginateInterface`

#### Type Declaration

##### retry

> **retry**: `object`

###### retry.retryRequest()

> **retryRequest**: (`error`, `retries`, `retryAfter`) => `RequestError`

###### Parameters

###### error

`RequestError`

###### retries

`number`

###### retryAfter

`number`

###### Returns

`RequestError`

***

### report

> **report**: [`RuleReporter`](/generated/api/type-aliases/rulereporter/)

Registers a new violation.
