---
editUrl: false
next: false
prev: false
title: "CommentEntity"
---

A resolved comment entity from GitHub.
Can be a comment on an issue, pull request, or discussion.

## Properties

### commentId

> **commentId**: `number`

***

### data

> **data**: `object`

#### id

> **id**: `number`

Format: int64

##### Description

Unique identifier of the issue comment

##### Example

```ts
42
```

#### node\_id

> **node\_id**: `string`

#### url

> **url**: `string`

Format: uri

##### Description

URL for the issue comment

##### Example

```ts
https://api.github.com/repositories/42/issues/comments/1
```

#### body?

> `optional` **body**: `string`

##### Description

Contents of the issue comment

##### Example

```ts
What version of Safari were you using when you observed this bug?
```

#### body\_text?

> `optional` **body\_text**: `string`

#### body\_html?

> `optional` **body\_html**: `string`

#### html\_url

> **html\_url**: `string`

Format: uri

#### user

> **user**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### created\_at

> **created\_at**: `string`

Format: date-time

##### Example

```ts
2011-04-14T16:00:49Z
```

#### updated\_at

> **updated\_at**: `string`

Format: date-time

##### Example

```ts
2011-04-14T16:00:49Z
```

#### issue\_url

> **issue\_url**: `string`

Format: uri

#### author\_association

> **author\_association**: `"COLLABORATOR"` \| `"CONTRIBUTOR"` \| `"FIRST_TIMER"` \| `"FIRST_TIME_CONTRIBUTOR"` \| `"MANNEQUIN"` \| `"MEMBER"` \| `"NONE"` \| `"OWNER"`

#### performed\_via\_github\_app?

> `optional` **performed\_via\_github\_app**: \{ `id`: `number`; `slug?`: `string`; `node_id`: `string`; `client_id?`: `string`; `owner`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| \{ `description?`: `string` \| `null`; `html_url`: `string`; `website_url?`: `string` \| `null`; `id`: `number`; `node_id`: `string`; `name`: `string`; `slug`: `string`; `created_at`: `string` \| `null`; `updated_at`: `string` \| `null`; `avatar_url`: `string`; \}; `name`: `string`; `description`: `string` \| `null`; `external_url`: `string`; `html_url`: `string`; `created_at`: `string`; `updated_at`: `string`; `permissions`: \{\[`key`: `string`\]: `string` \| `undefined`; `issues?`: `string`; `checks?`: `string`; `metadata?`: `string`; `contents?`: `string`; `deployments?`: `string`; \}; `events`: `string`[]; `installations_count?`: `number`; `client_secret?`: `string`; `webhook_secret?`: `string` \| `null`; `pem?`: `string`; \} \| `null`

##### Type Declaration

\{ `id`: `number`; `slug?`: `string`; `node_id`: `string`; `client_id?`: `string`; `owner`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| \{ `description?`: `string` \| `null`; `html_url`: `string`; `website_url?`: `string` \| `null`; `id`: `number`; `node_id`: `string`; `name`: `string`; `slug`: `string`; `created_at`: `string` \| `null`; `updated_at`: `string` \| `null`; `avatar_url`: `string`; \}; `name`: `string`; `description`: `string` \| `null`; `external_url`: `string`; `html_url`: `string`; `created_at`: `string`; `updated_at`: `string`; `permissions`: \{\[`key`: `string`\]: `string` \| `undefined`; `issues?`: `string`; `checks?`: `string`; `metadata?`: `string`; `contents?`: `string`; `deployments?`: `string`; \}; `events`: `string`[]; `installations_count?`: `number`; `client_secret?`: `string`; `webhook_secret?`: `string` \| `null`; `pem?`: `string`; \}

`null`

#### reactions?

> `optional` **reactions**: `object`

##### reactions.url

> **url**: `string`

Format: uri

##### reactions.total\_count

> **total\_count**: `number`

##### reactions.+1

> **+1**: `number`

##### reactions.-1

> **-1**: `number`

##### reactions.laugh

> **laugh**: `number`

##### reactions.confused

> **confused**: `number`

##### reactions.heart

> **heart**: `number`

##### reactions.hooray

> **hooray**: `number`

##### reactions.eyes

> **eyes**: `number`

##### reactions.rocket

> **rocket**: `number`

***

### parentNumber

> **parentNumber**: `number`

***

### parentType

> **parentType**: `"discussion"` \| `"issue"` \| `"pull_request"`

***

### type

> **type**: `"comment"`
