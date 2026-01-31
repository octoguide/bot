---
editUrl: false
next: false
prev: false
title: "IssueEntity"
---

A resolved issue entity from GitHub.

## Properties

### data

> **data**: `object`

#### id

> **id**: `number`

Format: int64

#### node\_id

> **node\_id**: `string`

#### url

> **url**: `string`

Format: uri

##### Description

URL for the issue

##### Example

```ts
https://api.github.com/repositories/42/issues/1
```

#### repository\_url

> **repository\_url**: `string`

Format: uri

#### labels\_url

> **labels\_url**: `string`

#### comments\_url

> **comments\_url**: `string`

Format: uri

#### events\_url

> **events\_url**: `string`

Format: uri

#### html\_url

> **html\_url**: `string`

Format: uri

#### number

> **number**: `number`

##### Description

Number uniquely identifying the issue within its repository

##### Example

```ts
42
```

#### state

> **state**: `string`

##### Description

State of the issue; either 'open' or 'closed'

##### Example

```ts
open
```

#### state\_reason?

> `optional` **state\_reason**: `"completed"` \| `"reopened"` \| `"not_planned"` \| `null`

##### Description

The reason for the current state

##### Example

```ts
not_planned
@enum {string|null}
```

#### title

> **title**: `string`

##### Description

Title of the issue

##### Example

```ts
Widget creation fails in Safari on OS X 10.8
```

#### body?

> `optional` **body**: `string` \| `null`

##### Description

Contents of the issue

##### Example

```ts
It looks like the new widget form is broken on Safari. When I try and create the widget, Safari crashes. This is reproducible on 10.8, but not 10.9. Maybe a browser bug?
```

#### user

> **user**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### labels

> **labels**: (`string` \| \{ `id?`: `number`; `node_id?`: `string`; `url?`: `string`; `name?`: `string`; `description?`: `string` \| `null`; `color?`: `string` \| `null`; `default?`: `boolean`; \})[]

##### Description

Labels to associate with this issue; pass one or more label names to replace the set of labels on this issue; send an empty array to clear all labels from the issue; note that the labels are silently dropped for users without push access to the repository

##### Example

```ts
[
  "bug",
  "registration"
]
```

#### assignee

> **assignee**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### assignees?

> `optional` **assignees**: `object`[] \| `null`

#### milestone

> **milestone**: \{ `url`: `string`; `html_url`: `string`; `labels_url`: `string`; `id`: `number`; `node_id`: `string`; `number`: `number`; `state`: `"open"` \| `"closed"`; `title`: `string`; `description`: `string` \| `null`; `creator`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`; `open_issues`: `number`; `closed_issues`: `number`; `created_at`: `string`; `updated_at`: `string`; `closed_at`: `string` \| `null`; `due_on`: `string` \| `null`; \} \| `null`

##### Type Declaration

\{ `url`: `string`; `html_url`: `string`; `labels_url`: `string`; `id`: `number`; `node_id`: `string`; `number`: `number`; `state`: `"open"` \| `"closed"`; `title`: `string`; `description`: `string` \| `null`; `creator`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`; `open_issues`: `number`; `closed_issues`: `number`; `created_at`: `string`; `updated_at`: `string`; `closed_at`: `string` \| `null`; `due_on`: `string` \| `null`; \}

`null`

#### locked

> **locked**: `boolean`

#### active\_lock\_reason?

> `optional` **active\_lock\_reason**: `string` \| `null`

#### comments

> **comments**: `number`

#### pull\_request?

> `optional` **pull\_request**: `object`

##### pull\_request.merged\_at?

> `optional` **merged\_at**: `string` \| `null`

Format: date-time

##### pull\_request.diff\_url

> **diff\_url**: `string` \| `null`

Format: uri

##### pull\_request.html\_url

> **html\_url**: `string` \| `null`

Format: uri

##### pull\_request.patch\_url

> **patch\_url**: `string` \| `null`

Format: uri

##### pull\_request.url

> **url**: `string` \| `null`

Format: uri

#### closed\_at

> **closed\_at**: `string` \| `null`

Format: date-time

#### created\_at

> **created\_at**: `string`

Format: date-time

#### updated\_at

> **updated\_at**: `string`

Format: date-time

#### draft?

> `optional` **draft**: `boolean`

#### closed\_by?

> `optional` **closed\_by**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### body\_html?

> `optional` **body\_html**: `string`

#### body\_text?

> `optional` **body\_text**: `string`

#### timeline\_url?

> `optional` **timeline\_url**: `string`

Format: uri

#### type?

> `optional` **type**: \{ `id`: `number`; `node_id`: `string`; `name`: `string`; `description`: `string` \| `null`; `color?`: `"gray"` \| `"blue"` \| `"green"` \| `"yellow"` \| `"orange"` \| `"red"` \| `"pink"` \| `"purple"` \| `null`; `created_at?`: `string`; `updated_at?`: `string`; `is_enabled?`: `boolean`; \} \| `null`

##### Type Declaration

\{ `id`: `number`; `node_id`: `string`; `name`: `string`; `description`: `string` \| `null`; `color?`: `"gray"` \| `"blue"` \| `"green"` \| `"yellow"` \| `"orange"` \| `"red"` \| `"pink"` \| `"purple"` \| `null`; `created_at?`: `string`; `updated_at?`: `string`; `is_enabled?`: `boolean`; \}

`null`

#### repository?

> `optional` **repository**: `object`

##### repository.id

> **id**: `number`

Format: int64

###### Description

Unique identifier of the repository

###### Example

```ts
42
```

##### repository.node\_id

> **node\_id**: `string`

###### Example

```ts
MDEwOlJlcG9zaXRvcnkxMjk2MjY5
```

##### repository.name

> **name**: `string`

###### Description

The name of the repository.

###### Example

```ts
Team Environment
```

##### repository.full\_name

> **full\_name**: `string`

###### Example

```ts
octocat/Hello-World
```

##### repository.license

> **license**: \{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \} \| `null`

###### Type Declaration

\{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \}

`null`

##### repository.forks

> **forks**: `number`

##### repository.permissions?

> `optional` **permissions**: `object`

##### repository.permissions.admin

> **admin**: `boolean`

##### repository.permissions.pull

> **pull**: `boolean`

##### repository.permissions.triage?

> `optional` **triage**: `boolean`

##### repository.permissions.push

> **push**: `boolean`

##### repository.permissions.maintain?

> `optional` **maintain**: `boolean`

##### repository.owner

> **owner**: `object`

##### repository.owner.name?

> `optional` **name**: `string` \| `null`

##### repository.owner.email?

> `optional` **email**: `string` \| `null`

##### repository.owner.login

> **login**: `string`

###### Example

```ts
octocat
```

##### repository.owner.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### repository.owner.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### repository.owner.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### repository.owner.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### repository.owner.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### repository.owner.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### repository.owner.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### repository.owner.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### repository.owner.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### repository.owner.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### repository.owner.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### repository.owner.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### repository.owner.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### repository.owner.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### repository.owner.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### repository.owner.type

> **type**: `string`

###### Example

```ts
User
```

##### repository.owner.site\_admin

> **site\_admin**: `boolean`

##### repository.owner.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### repository.owner.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

##### repository.private

> **private**: `boolean`

###### Description

Whether the repository is private or public.

###### Default

```ts
false
```

##### repository.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat/Hello-World
```

##### repository.description

> **description**: `string` \| `null`

###### Example

```ts
This your first repo!
```

##### repository.fork

> **fork**: `boolean`

##### repository.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/repos/octocat/Hello-World
```

##### repository.archive\_url

> **archive\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}
```

##### repository.assignees\_url

> **assignees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/assignees{/user}
```

##### repository.blobs\_url

> **blobs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}
```

##### repository.branches\_url

> **branches\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/branches{/branch}
```

##### repository.collaborators\_url

> **collaborators\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}
```

##### repository.comments\_url

> **comments\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/comments{/number}
```

##### repository.commits\_url

> **commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/commits{/sha}
```

##### repository.compare\_url

> **compare\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}
```

##### repository.contents\_url

> **contents\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contents/{+path}
```

##### repository.contributors\_url

> **contributors\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contributors
```

##### repository.deployments\_url

> **deployments\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/deployments
```

##### repository.downloads\_url

> **downloads\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/downloads
```

##### repository.events\_url

> **events\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/events
```

##### repository.forks\_url

> **forks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/forks
```

##### repository.git\_commits\_url

> **git\_commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}
```

##### repository.git\_refs\_url

> **git\_refs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}
```

##### repository.git\_tags\_url

> **git\_tags\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}
```

##### repository.git\_url

> **git\_url**: `string`

###### Example

```ts
git:github.com/octocat/Hello-World.git
```

##### repository.issue\_comment\_url

> **issue\_comment\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}
```

##### repository.issue\_events\_url

> **issue\_events\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/events{/number}
```

##### repository.issues\_url

> **issues\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues{/number}
```

##### repository.keys\_url

> **keys\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/keys{/key_id}
```

##### repository.labels\_url

> **labels\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/labels{/name}
```

##### repository.languages\_url

> **languages\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/languages
```

##### repository.merges\_url

> **merges\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/merges
```

##### repository.milestones\_url

> **milestones\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/milestones{/number}
```

##### repository.notifications\_url

> **notifications\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}
```

##### repository.pulls\_url

> **pulls\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/pulls{/number}
```

##### repository.releases\_url

> **releases\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/releases{/id}
```

##### repository.ssh\_url

> **ssh\_url**: `string`

###### Example

```ts
git@github.com:octocat/Hello-World.git
```

##### repository.stargazers\_url

> **stargazers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/stargazers
```

##### repository.statuses\_url

> **statuses\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/statuses/{sha}
```

##### repository.subscribers\_url

> **subscribers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscribers
```

##### repository.subscription\_url

> **subscription\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscription
```

##### repository.tags\_url

> **tags\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/tags
```

##### repository.teams\_url

> **teams\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/teams
```

##### repository.trees\_url

> **trees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}
```

##### repository.clone\_url

> **clone\_url**: `string`

###### Example

```ts
https://github.com/octocat/Hello-World.git
```

##### repository.mirror\_url

> **mirror\_url**: `string` \| `null`

Format: uri

###### Example

```ts
git:git.example.com/octocat/Hello-World
```

##### repository.hooks\_url

> **hooks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/hooks
```

##### repository.svn\_url

> **svn\_url**: `string`

Format: uri

###### Example

```ts
https://svn.github.com/octocat/Hello-World
```

##### repository.homepage

> **homepage**: `string` \| `null`

Format: uri

###### Example

```ts
https://github.com
```

##### repository.language

> **language**: `string` \| `null`

##### repository.forks\_count

> **forks\_count**: `number`

###### Example

```ts
9
```

##### repository.stargazers\_count

> **stargazers\_count**: `number`

###### Example

```ts
80
```

##### repository.watchers\_count

> **watchers\_count**: `number`

###### Example

```ts
80
```

##### repository.size

> **size**: `number`

###### Description

The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.

###### Example

```ts
108
```

##### repository.default\_branch

> **default\_branch**: `string`

###### Description

The default branch of the repository.

###### Example

```ts
master
```

##### repository.open\_issues\_count

> **open\_issues\_count**: `number`

###### Example

```ts
0
```

##### repository.is\_template?

> `optional` **is\_template**: `boolean`

###### Description

Whether this repository acts as a template that can be used to generate new repositories.

###### Default

```ts
false
```

###### Example

```ts
true
```

##### repository.topics?

> `optional` **topics**: `string`[]

##### repository.has\_issues

> **has\_issues**: `boolean`

###### Description

Whether issues are enabled.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.has\_projects

> **has\_projects**: `boolean`

###### Description

Whether projects are enabled.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.has\_wiki

> **has\_wiki**: `boolean`

###### Description

Whether the wiki is enabled.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.has\_pages

> **has\_pages**: `boolean`

##### repository.has\_downloads

> **has\_downloads**: `boolean`

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

###### Description

Whether downloads are enabled.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.has\_discussions?

> `optional` **has\_discussions**: `boolean`

###### Description

Whether discussions are enabled.

###### Default

```ts
false
```

###### Example

```ts
true
```

##### repository.archived

> **archived**: `boolean`

###### Description

Whether the repository is archived.

###### Default

```ts
false
```

##### repository.disabled

> **disabled**: `boolean`

###### Description

Returns whether or not this repository disabled.

##### repository.visibility?

> `optional` **visibility**: `string`

###### Description

The repository visibility: public, private, or internal.

###### Default

```ts
public
```

##### repository.pushed\_at

> **pushed\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:06:43Z
```

##### repository.created\_at

> **created\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:01:12Z
```

##### repository.updated\_at

> **updated\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:14:43Z
```

##### repository.allow\_rebase\_merge?

> `optional` **allow\_rebase\_merge**: `boolean`

###### Description

Whether to allow rebase merges for pull requests.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.temp\_clone\_token?

> `optional` **temp\_clone\_token**: `string`

##### repository.allow\_squash\_merge?

> `optional` **allow\_squash\_merge**: `boolean`

###### Description

Whether to allow squash merges for pull requests.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.allow\_auto\_merge?

> `optional` **allow\_auto\_merge**: `boolean`

###### Description

Whether to allow Auto-merge to be used on pull requests.

###### Default

```ts
false
```

###### Example

```ts
false
```

##### repository.delete\_branch\_on\_merge?

> `optional` **delete\_branch\_on\_merge**: `boolean`

###### Description

Whether to delete head branches when pull requests are merged

###### Default

```ts
false
```

###### Example

```ts
false
```

##### repository.allow\_update\_branch?

> `optional` **allow\_update\_branch**: `boolean`

###### Description

Whether or not a pull request head branch that is behind its base branch can always be updated even if it is not required to be up to date before merging.

###### Default

```ts
false
```

###### Example

```ts
false
```

##### repository.use\_squash\_pr\_title\_as\_default?

> `optional` **use\_squash\_pr\_title\_as\_default**: `boolean`

:::caution[Deprecated]
This API is no longer supported and may be removed in a future release.
:::

###### Description

Whether a squash merge commit can use the pull request title as default. **This property is closing down. Please use `squash_merge_commit_title` instead.

###### Default

```ts
false
```

##### repository.squash\_merge\_commit\_title?

> `optional` **squash\_merge\_commit\_title**: `"PR_TITLE"` \| `"COMMIT_OR_PR_TITLE"`

###### Description

The default value for a squash merge commit title:

- `PR_TITLE` - default to the pull request's title.
- `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).

##### repository.squash\_merge\_commit\_message?

> `optional` **squash\_merge\_commit\_message**: `"PR_BODY"` \| `"COMMIT_MESSAGES"` \| `"BLANK"`

###### Description

The default value for a squash merge commit message:

- `PR_BODY` - default to the pull request's body.
- `COMMIT_MESSAGES` - default to the branch's commit messages.
- `BLANK` - default to a blank commit message.

##### repository.merge\_commit\_title?

> `optional` **merge\_commit\_title**: `"PR_TITLE"` \| `"MERGE_MESSAGE"`

###### Description

The default value for a merge commit title.

- `PR_TITLE` - default to the pull request's title.
- `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).

##### repository.merge\_commit\_message?

> `optional` **merge\_commit\_message**: `"PR_TITLE"` \| `"PR_BODY"` \| `"BLANK"`

###### Description

The default value for a merge commit message.

- `PR_TITLE` - default to the pull request's title.
- `PR_BODY` - default to the pull request's body.
- `BLANK` - default to a blank commit message.

##### repository.allow\_merge\_commit?

> `optional` **allow\_merge\_commit**: `boolean`

###### Description

Whether to allow merge commits for pull requests.

###### Default

```ts
true
```

###### Example

```ts
true
```

##### repository.allow\_forking?

> `optional` **allow\_forking**: `boolean`

###### Description

Whether to allow forking this repo

##### repository.web\_commit\_signoff\_required?

> `optional` **web\_commit\_signoff\_required**: `boolean`

###### Description

Whether to require contributors to sign off on web-based commits

###### Default

```ts
false
```

##### repository.open\_issues

> **open\_issues**: `number`

##### repository.watchers

> **watchers**: `number`

##### repository.master\_branch?

> `optional` **master\_branch**: `string`

##### repository.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:42Z"
```

##### repository.anonymous\_access\_enabled?

> `optional` **anonymous\_access\_enabled**: `boolean`

###### Description

Whether anonymous git access is enabled for this repository

##### repository.code\_search\_index\_status?

> `optional` **code\_search\_index\_status**: `object`

###### Description

The status of the code search index for this repository

##### repository.code\_search\_index\_status.lexical\_search\_ok?

> `optional` **lexical\_search\_ok**: `boolean`

##### repository.code\_search\_index\_status.lexical\_commit\_sha?

> `optional` **lexical\_commit\_sha**: `string`

#### performed\_via\_github\_app?

> `optional` **performed\_via\_github\_app**: \{ `id`: `number`; `slug?`: `string`; `node_id`: `string`; `client_id?`: `string`; `owner`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| \{ `description?`: `string` \| `null`; `html_url`: `string`; `website_url?`: `string` \| `null`; `id`: `number`; `node_id`: `string`; `name`: `string`; `slug`: `string`; `created_at`: `string` \| `null`; `updated_at`: `string` \| `null`; `avatar_url`: `string`; \}; `name`: `string`; `description`: `string` \| `null`; `external_url`: `string`; `html_url`: `string`; `created_at`: `string`; `updated_at`: `string`; `permissions`: \{\[`key`: `string`\]: `string` \| `undefined`; `issues?`: `string`; `checks?`: `string`; `metadata?`: `string`; `contents?`: `string`; `deployments?`: `string`; \}; `events`: `string`[]; `installations_count?`: `number`; `client_secret?`: `string`; `webhook_secret?`: `string` \| `null`; `pem?`: `string`; \} \| `null`

##### Type Declaration

\{ `id`: `number`; `slug?`: `string`; `node_id`: `string`; `client_id?`: `string`; `owner`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| \{ `description?`: `string` \| `null`; `html_url`: `string`; `website_url?`: `string` \| `null`; `id`: `number`; `node_id`: `string`; `name`: `string`; `slug`: `string`; `created_at`: `string` \| `null`; `updated_at`: `string` \| `null`; `avatar_url`: `string`; \}; `name`: `string`; `description`: `string` \| `null`; `external_url`: `string`; `html_url`: `string`; `created_at`: `string`; `updated_at`: `string`; `permissions`: \{\[`key`: `string`\]: `string` \| `undefined`; `issues?`: `string`; `checks?`: `string`; `metadata?`: `string`; `contents?`: `string`; `deployments?`: `string`; \}; `events`: `string`[]; `installations_count?`: `number`; `client_secret?`: `string`; `webhook_secret?`: `string` \| `null`; `pem?`: `string`; \}

`null`

#### author\_association

> **author\_association**: `"COLLABORATOR"` \| `"CONTRIBUTOR"` \| `"FIRST_TIMER"` \| `"FIRST_TIME_CONTRIBUTOR"` \| `"MANNEQUIN"` \| `"MEMBER"` \| `"NONE"` \| `"OWNER"`

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

#### sub\_issues\_summary?

> `optional` **sub\_issues\_summary**: `object`

##### sub\_issues\_summary.total

> **total**: `number`

##### sub\_issues\_summary.completed

> **completed**: `number`

##### sub\_issues\_summary.percent\_completed

> **percent\_completed**: `number`

***

### number

> **number**: `number`

***

### type

> **type**: `"issue"`
