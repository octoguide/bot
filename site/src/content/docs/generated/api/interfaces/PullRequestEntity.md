---
editUrl: false
next: false
prev: false
title: "PullRequestEntity"
---

A resolved pull request entity from GitHub.

## Properties

### data

> **data**: `object`

#### url

> **url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/pulls/1347
```

#### id

> **id**: `number`

Format: int64

##### Example

```ts
1
```

#### node\_id

> **node\_id**: `string`

##### Example

```ts
MDExOlB1bGxSZXF1ZXN0MQ==
```

#### html\_url

> **html\_url**: `string`

Format: uri

##### Example

```ts
https://github.com/octocat/Hello-World/pull/1347
```

#### diff\_url

> **diff\_url**: `string`

Format: uri

##### Example

```ts
https://github.com/octocat/Hello-World/pull/1347.diff
```

#### patch\_url

> **patch\_url**: `string`

Format: uri

##### Example

```ts
https://github.com/octocat/Hello-World/pull/1347.patch
```

#### issue\_url

> **issue\_url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/issues/1347
```

#### commits\_url

> **commits\_url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/pulls/1347/commits
```

#### review\_comments\_url

> **review\_comments\_url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/pulls/1347/comments
```

#### review\_comment\_url

> **review\_comment\_url**: `string`

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/pulls/comments{/number}
```

#### comments\_url

> **comments\_url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/issues/1347/comments
```

#### statuses\_url

> **statuses\_url**: `string`

Format: uri

##### Example

```ts
https://api.github.com/repos/octocat/Hello-World/statuses/6dcb09b5b57875f334f61aebed695e2e4193db5e
```

#### number

> **number**: `number`

##### Description

Number uniquely identifying the pull request within its repository.

##### Example

```ts
42
```

#### state

> **state**: `"open"` \| `"closed"`

##### Description

State of this Pull Request. Either `open` or `closed`.

##### Example

```ts
open
@enum {string}
```

#### locked

> **locked**: `boolean`

##### Example

```ts
true
```

#### title

> **title**: `string`

##### Description

The title of the pull request.

##### Example

```ts
Amazing new feature
```

#### user

> **user**: `object`

##### user.name?

> `optional` **name**: `string` \| `null`

##### user.email?

> `optional` **email**: `string` \| `null`

##### user.login

> **login**: `string`

###### Example

```ts
octocat
```

##### user.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### user.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### user.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### user.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### user.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### user.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### user.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### user.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### user.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### user.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### user.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### user.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### user.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### user.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### user.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### user.type

> **type**: `string`

###### Example

```ts
User
```

##### user.site\_admin

> **site\_admin**: `boolean`

##### user.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### user.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

#### body

> **body**: `string` \| `null`

##### Example

```ts
Please pull these awesome changes
```

#### labels

> **labels**: `object`[]

#### milestone

> **milestone**: \{ `url`: `string`; `html_url`: `string`; `labels_url`: `string`; `id`: `number`; `node_id`: `string`; `number`: `number`; `state`: `"open"` \| `"closed"`; `title`: `string`; `description`: `string` \| `null`; `creator`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`; `open_issues`: `number`; `closed_issues`: `number`; `created_at`: `string`; `updated_at`: `string`; `closed_at`: `string` \| `null`; `due_on`: `string` \| `null`; \} \| `null`

##### Type Declaration

\{ `url`: `string`; `html_url`: `string`; `labels_url`: `string`; `id`: `number`; `node_id`: `string`; `number`: `number`; `state`: `"open"` \| `"closed"`; `title`: `string`; `description`: `string` \| `null`; `creator`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`; `open_issues`: `number`; `closed_issues`: `number`; `created_at`: `string`; `updated_at`: `string`; `closed_at`: `string` \| `null`; `due_on`: `string` \| `null`; \}

`null`

#### active\_lock\_reason?

> `optional` **active\_lock\_reason**: `string` \| `null`

##### Example

```ts
too heated
```

#### created\_at

> **created\_at**: `string`

Format: date-time

##### Example

```ts
2011-01-26T19:01:12Z
```

#### updated\_at

> **updated\_at**: `string`

Format: date-time

##### Example

```ts
2011-01-26T19:01:12Z
```

#### closed\_at

> **closed\_at**: `string` \| `null`

Format: date-time

##### Example

```ts
2011-01-26T19:01:12Z
```

#### merged\_at

> **merged\_at**: `string` \| `null`

Format: date-time

##### Example

```ts
2011-01-26T19:01:12Z
```

#### merge\_commit\_sha

> **merge\_commit\_sha**: `string` \| `null`

##### Example

```ts
e5bd3914e2e596debea16f433f57875b5b90bcd6
```

#### assignee

> **assignee**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### assignees?

> `optional` **assignees**: `object`[] \| `null`

#### requested\_reviewers?

> `optional` **requested\_reviewers**: `object`[] \| `null`

#### requested\_teams?

> `optional` **requested\_teams**: `object`[] \| `null`

#### head

> **head**: `object`

##### head.label

> **label**: `string`

##### head.ref

> **ref**: `string`

##### head.repo

> **repo**: `object`

##### head.repo.id

> **id**: `number`

Format: int64

###### Description

Unique identifier of the repository

###### Example

```ts
42
```

##### head.repo.node\_id

> **node\_id**: `string`

###### Example

```ts
MDEwOlJlcG9zaXRvcnkxMjk2MjY5
```

##### head.repo.name

> **name**: `string`

###### Description

The name of the repository.

###### Example

```ts
Team Environment
```

##### head.repo.full\_name

> **full\_name**: `string`

###### Example

```ts
octocat/Hello-World
```

##### head.repo.license

> **license**: \{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \} \| `null`

###### Type Declaration

\{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \}

`null`

##### head.repo.forks

> **forks**: `number`

##### head.repo.permissions?

> `optional` **permissions**: `object`

##### head.repo.permissions.admin

> **admin**: `boolean`

##### head.repo.permissions.pull

> **pull**: `boolean`

##### head.repo.permissions.triage?

> `optional` **triage**: `boolean`

##### head.repo.permissions.push

> **push**: `boolean`

##### head.repo.permissions.maintain?

> `optional` **maintain**: `boolean`

##### head.repo.owner

> **owner**: `object`

##### head.repo.owner.name?

> `optional` **name**: `string` \| `null`

##### head.repo.owner.email?

> `optional` **email**: `string` \| `null`

##### head.repo.owner.login

> **login**: `string`

###### Example

```ts
octocat
```

##### head.repo.owner.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### head.repo.owner.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### head.repo.owner.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### head.repo.owner.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### head.repo.owner.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### head.repo.owner.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### head.repo.owner.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### head.repo.owner.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### head.repo.owner.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### head.repo.owner.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### head.repo.owner.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### head.repo.owner.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### head.repo.owner.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### head.repo.owner.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### head.repo.owner.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### head.repo.owner.type

> **type**: `string`

###### Example

```ts
User
```

##### head.repo.owner.site\_admin

> **site\_admin**: `boolean`

##### head.repo.owner.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### head.repo.owner.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

##### head.repo.private

> **private**: `boolean`

###### Description

Whether the repository is private or public.

###### Default

```ts
false
```

##### head.repo.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat/Hello-World
```

##### head.repo.description

> **description**: `string` \| `null`

###### Example

```ts
This your first repo!
```

##### head.repo.fork

> **fork**: `boolean`

##### head.repo.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/repos/octocat/Hello-World
```

##### head.repo.archive\_url

> **archive\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}
```

##### head.repo.assignees\_url

> **assignees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/assignees{/user}
```

##### head.repo.blobs\_url

> **blobs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}
```

##### head.repo.branches\_url

> **branches\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/branches{/branch}
```

##### head.repo.collaborators\_url

> **collaborators\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}
```

##### head.repo.comments\_url

> **comments\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/comments{/number}
```

##### head.repo.commits\_url

> **commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/commits{/sha}
```

##### head.repo.compare\_url

> **compare\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}
```

##### head.repo.contents\_url

> **contents\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contents/{+path}
```

##### head.repo.contributors\_url

> **contributors\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contributors
```

##### head.repo.deployments\_url

> **deployments\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/deployments
```

##### head.repo.downloads\_url

> **downloads\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/downloads
```

##### head.repo.events\_url

> **events\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/events
```

##### head.repo.forks\_url

> **forks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/forks
```

##### head.repo.git\_commits\_url

> **git\_commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}
```

##### head.repo.git\_refs\_url

> **git\_refs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}
```

##### head.repo.git\_tags\_url

> **git\_tags\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}
```

##### head.repo.git\_url

> **git\_url**: `string`

###### Example

```ts
git:github.com/octocat/Hello-World.git
```

##### head.repo.issue\_comment\_url

> **issue\_comment\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}
```

##### head.repo.issue\_events\_url

> **issue\_events\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/events{/number}
```

##### head.repo.issues\_url

> **issues\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues{/number}
```

##### head.repo.keys\_url

> **keys\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/keys{/key_id}
```

##### head.repo.labels\_url

> **labels\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/labels{/name}
```

##### head.repo.languages\_url

> **languages\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/languages
```

##### head.repo.merges\_url

> **merges\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/merges
```

##### head.repo.milestones\_url

> **milestones\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/milestones{/number}
```

##### head.repo.notifications\_url

> **notifications\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}
```

##### head.repo.pulls\_url

> **pulls\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/pulls{/number}
```

##### head.repo.releases\_url

> **releases\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/releases{/id}
```

##### head.repo.ssh\_url

> **ssh\_url**: `string`

###### Example

```ts
git@github.com:octocat/Hello-World.git
```

##### head.repo.stargazers\_url

> **stargazers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/stargazers
```

##### head.repo.statuses\_url

> **statuses\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/statuses/{sha}
```

##### head.repo.subscribers\_url

> **subscribers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscribers
```

##### head.repo.subscription\_url

> **subscription\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscription
```

##### head.repo.tags\_url

> **tags\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/tags
```

##### head.repo.teams\_url

> **teams\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/teams
```

##### head.repo.trees\_url

> **trees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}
```

##### head.repo.clone\_url

> **clone\_url**: `string`

###### Example

```ts
https://github.com/octocat/Hello-World.git
```

##### head.repo.mirror\_url

> **mirror\_url**: `string` \| `null`

Format: uri

###### Example

```ts
git:git.example.com/octocat/Hello-World
```

##### head.repo.hooks\_url

> **hooks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/hooks
```

##### head.repo.svn\_url

> **svn\_url**: `string`

Format: uri

###### Example

```ts
https://svn.github.com/octocat/Hello-World
```

##### head.repo.homepage

> **homepage**: `string` \| `null`

Format: uri

###### Example

```ts
https://github.com
```

##### head.repo.language

> **language**: `string` \| `null`

##### head.repo.forks\_count

> **forks\_count**: `number`

###### Example

```ts
9
```

##### head.repo.stargazers\_count

> **stargazers\_count**: `number`

###### Example

```ts
80
```

##### head.repo.watchers\_count

> **watchers\_count**: `number`

###### Example

```ts
80
```

##### head.repo.size

> **size**: `number`

###### Description

The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.

###### Example

```ts
108
```

##### head.repo.default\_branch

> **default\_branch**: `string`

###### Description

The default branch of the repository.

###### Example

```ts
master
```

##### head.repo.open\_issues\_count

> **open\_issues\_count**: `number`

###### Example

```ts
0
```

##### head.repo.is\_template?

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

##### head.repo.topics?

> `optional` **topics**: `string`[]

##### head.repo.has\_issues

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

##### head.repo.has\_projects

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

##### head.repo.has\_wiki

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

##### head.repo.has\_pages

> **has\_pages**: `boolean`

##### head.repo.has\_downloads

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

##### head.repo.has\_discussions?

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

##### head.repo.archived

> **archived**: `boolean`

###### Description

Whether the repository is archived.

###### Default

```ts
false
```

##### head.repo.disabled

> **disabled**: `boolean`

###### Description

Returns whether or not this repository disabled.

##### head.repo.visibility?

> `optional` **visibility**: `string`

###### Description

The repository visibility: public, private, or internal.

###### Default

```ts
public
```

##### head.repo.pushed\_at

> **pushed\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:06:43Z
```

##### head.repo.created\_at

> **created\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:01:12Z
```

##### head.repo.updated\_at

> **updated\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:14:43Z
```

##### head.repo.allow\_rebase\_merge?

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

##### head.repo.temp\_clone\_token?

> `optional` **temp\_clone\_token**: `string`

##### head.repo.allow\_squash\_merge?

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

##### head.repo.allow\_auto\_merge?

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

##### head.repo.delete\_branch\_on\_merge?

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

##### head.repo.allow\_update\_branch?

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

##### head.repo.use\_squash\_pr\_title\_as\_default?

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

##### head.repo.squash\_merge\_commit\_title?

> `optional` **squash\_merge\_commit\_title**: `"PR_TITLE"` \| `"COMMIT_OR_PR_TITLE"`

###### Description

The default value for a squash merge commit title:

- `PR_TITLE` - default to the pull request's title.
- `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).

##### head.repo.squash\_merge\_commit\_message?

> `optional` **squash\_merge\_commit\_message**: `"PR_BODY"` \| `"COMMIT_MESSAGES"` \| `"BLANK"`

###### Description

The default value for a squash merge commit message:

- `PR_BODY` - default to the pull request's body.
- `COMMIT_MESSAGES` - default to the branch's commit messages.
- `BLANK` - default to a blank commit message.

##### head.repo.merge\_commit\_title?

> `optional` **merge\_commit\_title**: `"PR_TITLE"` \| `"MERGE_MESSAGE"`

###### Description

The default value for a merge commit title.

- `PR_TITLE` - default to the pull request's title.
- `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).

##### head.repo.merge\_commit\_message?

> `optional` **merge\_commit\_message**: `"PR_TITLE"` \| `"PR_BODY"` \| `"BLANK"`

###### Description

The default value for a merge commit message.

- `PR_TITLE` - default to the pull request's title.
- `PR_BODY` - default to the pull request's body.
- `BLANK` - default to a blank commit message.

##### head.repo.allow\_merge\_commit?

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

##### head.repo.allow\_forking?

> `optional` **allow\_forking**: `boolean`

###### Description

Whether to allow forking this repo

##### head.repo.web\_commit\_signoff\_required?

> `optional` **web\_commit\_signoff\_required**: `boolean`

###### Description

Whether to require contributors to sign off on web-based commits

###### Default

```ts
false
```

##### head.repo.open\_issues

> **open\_issues**: `number`

##### head.repo.watchers

> **watchers**: `number`

##### head.repo.master\_branch?

> `optional` **master\_branch**: `string`

##### head.repo.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:42Z"
```

##### head.repo.anonymous\_access\_enabled?

> `optional` **anonymous\_access\_enabled**: `boolean`

###### Description

Whether anonymous git access is enabled for this repository

##### head.repo.code\_search\_index\_status?

> `optional` **code\_search\_index\_status**: `object`

###### Description

The status of the code search index for this repository

##### head.repo.code\_search\_index\_status.lexical\_search\_ok?

> `optional` **lexical\_search\_ok**: `boolean`

##### head.repo.code\_search\_index\_status.lexical\_commit\_sha?

> `optional` **lexical\_commit\_sha**: `string`

##### head.sha

> **sha**: `string`

##### head.user

> **user**: `object`

##### head.user.name?

> `optional` **name**: `string` \| `null`

##### head.user.email?

> `optional` **email**: `string` \| `null`

##### head.user.login

> **login**: `string`

###### Example

```ts
octocat
```

##### head.user.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### head.user.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### head.user.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### head.user.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### head.user.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### head.user.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### head.user.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### head.user.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### head.user.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### head.user.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### head.user.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### head.user.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### head.user.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### head.user.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### head.user.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### head.user.type

> **type**: `string`

###### Example

```ts
User
```

##### head.user.site\_admin

> **site\_admin**: `boolean`

##### head.user.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### head.user.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

#### base

> **base**: `object`

##### base.label

> **label**: `string`

##### base.ref

> **ref**: `string`

##### base.repo

> **repo**: `object`

##### base.repo.id

> **id**: `number`

Format: int64

###### Description

Unique identifier of the repository

###### Example

```ts
42
```

##### base.repo.node\_id

> **node\_id**: `string`

###### Example

```ts
MDEwOlJlcG9zaXRvcnkxMjk2MjY5
```

##### base.repo.name

> **name**: `string`

###### Description

The name of the repository.

###### Example

```ts
Team Environment
```

##### base.repo.full\_name

> **full\_name**: `string`

###### Example

```ts
octocat/Hello-World
```

##### base.repo.license

> **license**: \{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \} \| `null`

###### Type Declaration

\{ `key`: `string`; `name`: `string`; `url`: `string` \| `null`; `spdx_id`: `string` \| `null`; `node_id`: `string`; `html_url?`: `string`; \}

`null`

##### base.repo.forks

> **forks**: `number`

##### base.repo.permissions?

> `optional` **permissions**: `object`

##### base.repo.permissions.admin

> **admin**: `boolean`

##### base.repo.permissions.pull

> **pull**: `boolean`

##### base.repo.permissions.triage?

> `optional` **triage**: `boolean`

##### base.repo.permissions.push

> **push**: `boolean`

##### base.repo.permissions.maintain?

> `optional` **maintain**: `boolean`

##### base.repo.owner

> **owner**: `object`

##### base.repo.owner.name?

> `optional` **name**: `string` \| `null`

##### base.repo.owner.email?

> `optional` **email**: `string` \| `null`

##### base.repo.owner.login

> **login**: `string`

###### Example

```ts
octocat
```

##### base.repo.owner.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### base.repo.owner.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### base.repo.owner.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### base.repo.owner.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### base.repo.owner.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### base.repo.owner.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### base.repo.owner.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### base.repo.owner.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### base.repo.owner.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### base.repo.owner.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### base.repo.owner.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### base.repo.owner.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### base.repo.owner.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### base.repo.owner.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### base.repo.owner.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### base.repo.owner.type

> **type**: `string`

###### Example

```ts
User
```

##### base.repo.owner.site\_admin

> **site\_admin**: `boolean`

##### base.repo.owner.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### base.repo.owner.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

##### base.repo.private

> **private**: `boolean`

###### Description

Whether the repository is private or public.

###### Default

```ts
false
```

##### base.repo.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat/Hello-World
```

##### base.repo.description

> **description**: `string` \| `null`

###### Example

```ts
This your first repo!
```

##### base.repo.fork

> **fork**: `boolean`

##### base.repo.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/repos/octocat/Hello-World
```

##### base.repo.archive\_url

> **archive\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/{archive_format}{/ref}
```

##### base.repo.assignees\_url

> **assignees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/assignees{/user}
```

##### base.repo.blobs\_url

> **blobs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/blobs{/sha}
```

##### base.repo.branches\_url

> **branches\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/branches{/branch}
```

##### base.repo.collaborators\_url

> **collaborators\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/collaborators{/collaborator}
```

##### base.repo.comments\_url

> **comments\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/comments{/number}
```

##### base.repo.commits\_url

> **commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/commits{/sha}
```

##### base.repo.compare\_url

> **compare\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/compare/{base}...{head}
```

##### base.repo.contents\_url

> **contents\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contents/{+path}
```

##### base.repo.contributors\_url

> **contributors\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/contributors
```

##### base.repo.deployments\_url

> **deployments\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/deployments
```

##### base.repo.downloads\_url

> **downloads\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/downloads
```

##### base.repo.events\_url

> **events\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/events
```

##### base.repo.forks\_url

> **forks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/forks
```

##### base.repo.git\_commits\_url

> **git\_commits\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/commits{/sha}
```

##### base.repo.git\_refs\_url

> **git\_refs\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/refs{/sha}
```

##### base.repo.git\_tags\_url

> **git\_tags\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/tags{/sha}
```

##### base.repo.git\_url

> **git\_url**: `string`

###### Example

```ts
git:github.com/octocat/Hello-World.git
```

##### base.repo.issue\_comment\_url

> **issue\_comment\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/comments{/number}
```

##### base.repo.issue\_events\_url

> **issue\_events\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues/events{/number}
```

##### base.repo.issues\_url

> **issues\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/issues{/number}
```

##### base.repo.keys\_url

> **keys\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/keys{/key_id}
```

##### base.repo.labels\_url

> **labels\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/labels{/name}
```

##### base.repo.languages\_url

> **languages\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/languages
```

##### base.repo.merges\_url

> **merges\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/merges
```

##### base.repo.milestones\_url

> **milestones\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/milestones{/number}
```

##### base.repo.notifications\_url

> **notifications\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/notifications{?since,all,participating}
```

##### base.repo.pulls\_url

> **pulls\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/pulls{/number}
```

##### base.repo.releases\_url

> **releases\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/releases{/id}
```

##### base.repo.ssh\_url

> **ssh\_url**: `string`

###### Example

```ts
git@github.com:octocat/Hello-World.git
```

##### base.repo.stargazers\_url

> **stargazers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/stargazers
```

##### base.repo.statuses\_url

> **statuses\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/statuses/{sha}
```

##### base.repo.subscribers\_url

> **subscribers\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscribers
```

##### base.repo.subscription\_url

> **subscription\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/subscription
```

##### base.repo.tags\_url

> **tags\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/tags
```

##### base.repo.teams\_url

> **teams\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/teams
```

##### base.repo.trees\_url

> **trees\_url**: `string`

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/git/trees{/sha}
```

##### base.repo.clone\_url

> **clone\_url**: `string`

###### Example

```ts
https://github.com/octocat/Hello-World.git
```

##### base.repo.mirror\_url

> **mirror\_url**: `string` \| `null`

Format: uri

###### Example

```ts
git:git.example.com/octocat/Hello-World
```

##### base.repo.hooks\_url

> **hooks\_url**: `string`

Format: uri

###### Example

```ts
http://api.github.com/repos/octocat/Hello-World/hooks
```

##### base.repo.svn\_url

> **svn\_url**: `string`

Format: uri

###### Example

```ts
https://svn.github.com/octocat/Hello-World
```

##### base.repo.homepage

> **homepage**: `string` \| `null`

Format: uri

###### Example

```ts
https://github.com
```

##### base.repo.language

> **language**: `string` \| `null`

##### base.repo.forks\_count

> **forks\_count**: `number`

###### Example

```ts
9
```

##### base.repo.stargazers\_count

> **stargazers\_count**: `number`

###### Example

```ts
80
```

##### base.repo.watchers\_count

> **watchers\_count**: `number`

###### Example

```ts
80
```

##### base.repo.size

> **size**: `number`

###### Description

The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.

###### Example

```ts
108
```

##### base.repo.default\_branch

> **default\_branch**: `string`

###### Description

The default branch of the repository.

###### Example

```ts
master
```

##### base.repo.open\_issues\_count

> **open\_issues\_count**: `number`

###### Example

```ts
0
```

##### base.repo.is\_template?

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

##### base.repo.topics?

> `optional` **topics**: `string`[]

##### base.repo.has\_issues

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

##### base.repo.has\_projects

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

##### base.repo.has\_wiki

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

##### base.repo.has\_pages

> **has\_pages**: `boolean`

##### base.repo.has\_downloads

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

##### base.repo.has\_discussions?

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

##### base.repo.archived

> **archived**: `boolean`

###### Description

Whether the repository is archived.

###### Default

```ts
false
```

##### base.repo.disabled

> **disabled**: `boolean`

###### Description

Returns whether or not this repository disabled.

##### base.repo.visibility?

> `optional` **visibility**: `string`

###### Description

The repository visibility: public, private, or internal.

###### Default

```ts
public
```

##### base.repo.pushed\_at

> **pushed\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:06:43Z
```

##### base.repo.created\_at

> **created\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:01:12Z
```

##### base.repo.updated\_at

> **updated\_at**: `string` \| `null`

Format: date-time

###### Example

```ts
2011-01-26T19:14:43Z
```

##### base.repo.allow\_rebase\_merge?

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

##### base.repo.temp\_clone\_token?

> `optional` **temp\_clone\_token**: `string`

##### base.repo.allow\_squash\_merge?

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

##### base.repo.allow\_auto\_merge?

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

##### base.repo.delete\_branch\_on\_merge?

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

##### base.repo.allow\_update\_branch?

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

##### base.repo.use\_squash\_pr\_title\_as\_default?

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

##### base.repo.squash\_merge\_commit\_title?

> `optional` **squash\_merge\_commit\_title**: `"PR_TITLE"` \| `"COMMIT_OR_PR_TITLE"`

###### Description

The default value for a squash merge commit title:

- `PR_TITLE` - default to the pull request's title.
- `COMMIT_OR_PR_TITLE` - default to the commit's title (if only one commit) or the pull request's title (when more than one commit).

##### base.repo.squash\_merge\_commit\_message?

> `optional` **squash\_merge\_commit\_message**: `"PR_BODY"` \| `"COMMIT_MESSAGES"` \| `"BLANK"`

###### Description

The default value for a squash merge commit message:

- `PR_BODY` - default to the pull request's body.
- `COMMIT_MESSAGES` - default to the branch's commit messages.
- `BLANK` - default to a blank commit message.

##### base.repo.merge\_commit\_title?

> `optional` **merge\_commit\_title**: `"PR_TITLE"` \| `"MERGE_MESSAGE"`

###### Description

The default value for a merge commit title.

- `PR_TITLE` - default to the pull request's title.
- `MERGE_MESSAGE` - default to the classic title for a merge message (e.g., Merge pull request #123 from branch-name).

##### base.repo.merge\_commit\_message?

> `optional` **merge\_commit\_message**: `"PR_TITLE"` \| `"PR_BODY"` \| `"BLANK"`

###### Description

The default value for a merge commit message.

- `PR_TITLE` - default to the pull request's title.
- `PR_BODY` - default to the pull request's body.
- `BLANK` - default to a blank commit message.

##### base.repo.allow\_merge\_commit?

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

##### base.repo.allow\_forking?

> `optional` **allow\_forking**: `boolean`

###### Description

Whether to allow forking this repo

##### base.repo.web\_commit\_signoff\_required?

> `optional` **web\_commit\_signoff\_required**: `boolean`

###### Description

Whether to require contributors to sign off on web-based commits

###### Default

```ts
false
```

##### base.repo.open\_issues

> **open\_issues**: `number`

##### base.repo.watchers

> **watchers**: `number`

##### base.repo.master\_branch?

> `optional` **master\_branch**: `string`

##### base.repo.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:42Z"
```

##### base.repo.anonymous\_access\_enabled?

> `optional` **anonymous\_access\_enabled**: `boolean`

###### Description

Whether anonymous git access is enabled for this repository

##### base.repo.code\_search\_index\_status?

> `optional` **code\_search\_index\_status**: `object`

###### Description

The status of the code search index for this repository

##### base.repo.code\_search\_index\_status.lexical\_search\_ok?

> `optional` **lexical\_search\_ok**: `boolean`

##### base.repo.code\_search\_index\_status.lexical\_commit\_sha?

> `optional` **lexical\_commit\_sha**: `string`

##### base.sha

> **sha**: `string`

##### base.user

> **user**: `object`

##### base.user.name?

> `optional` **name**: `string` \| `null`

##### base.user.email?

> `optional` **email**: `string` \| `null`

##### base.user.login

> **login**: `string`

###### Example

```ts
octocat
```

##### base.user.id

> **id**: `number`

Format: int64

###### Example

```ts
1
```

##### base.user.node\_id

> **node\_id**: `string`

###### Example

```ts
MDQ6VXNlcjE=
```

##### base.user.avatar\_url

> **avatar\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/images/error/octocat_happy.gif
```

##### base.user.gravatar\_id

> **gravatar\_id**: `string` \| `null`

###### Example

```ts
41d064eb2195891e12d0413f63227ea7
```

##### base.user.url

> **url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat
```

##### base.user.html\_url

> **html\_url**: `string`

Format: uri

###### Example

```ts
https://github.com/octocat
```

##### base.user.followers\_url

> **followers\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/followers
```

##### base.user.following\_url

> **following\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/following{/other_user}
```

##### base.user.gists\_url

> **gists\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/gists{/gist_id}
```

##### base.user.starred\_url

> **starred\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/starred{/owner}{/repo}
```

##### base.user.subscriptions\_url

> **subscriptions\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/subscriptions
```

##### base.user.organizations\_url

> **organizations\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/orgs
```

##### base.user.repos\_url

> **repos\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/repos
```

##### base.user.events\_url

> **events\_url**: `string`

###### Example

```ts
https://api.github.com/users/octocat/events{/privacy}
```

##### base.user.received\_events\_url

> **received\_events\_url**: `string`

Format: uri

###### Example

```ts
https://api.github.com/users/octocat/received_events
```

##### base.user.type

> **type**: `string`

###### Example

```ts
User
```

##### base.user.site\_admin

> **site\_admin**: `boolean`

##### base.user.starred\_at?

> `optional` **starred\_at**: `string`

###### Example

```ts
"2020-07-09T00:17:55Z"
```

##### base.user.user\_view\_type?

> `optional` **user\_view\_type**: `string`

###### Example

```ts
public
```

#### \_links

> **\_links**: `object`

##### \_links.comments

> **comments**: `object`

##### \_links.comments.href

> **href**: `string`

##### \_links.commits

> **commits**: `object`

##### \_links.commits.href

> **href**: `string`

##### \_links.statuses

> **statuses**: `object`

##### \_links.statuses.href

> **href**: `string`

##### \_links.html

> **html**: `object`

##### \_links.html.href

> **href**: `string`

##### \_links.issue

> **issue**: `object`

##### \_links.issue.href

> **href**: `string`

##### \_links.review\_comments

> **review\_comments**: `object`

##### \_links.review\_comments.href

> **href**: `string`

##### \_links.review\_comment

> **review\_comment**: `object`

##### \_links.review\_comment.href

> **href**: `string`

##### \_links.self

> **self**: `object`

##### \_links.self.href

> **href**: `string`

#### author\_association

> **author\_association**: `"COLLABORATOR"` \| `"CONTRIBUTOR"` \| `"FIRST_TIMER"` \| `"FIRST_TIME_CONTRIBUTOR"` \| `"MANNEQUIN"` \| `"MEMBER"` \| `"NONE"` \| `"OWNER"`

#### auto\_merge

> **auto\_merge**: \{ `enabled_by`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}; `merge_method`: `"merge"` \| `"squash"` \| `"rebase"`; `commit_title`: `string`; `commit_message`: `string`; \} \| `null`

##### Type Declaration

\{ `enabled_by`: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}; `merge_method`: `"merge"` \| `"squash"` \| `"rebase"`; `commit_title`: `string`; `commit_message`: `string`; \}

`null`

#### draft?

> `optional` **draft**: `boolean`

##### Description

Indicates whether or not the pull request is a draft.

##### Example

```ts
false
```

#### merged

> **merged**: `boolean`

#### mergeable

> **mergeable**: `boolean` \| `null`

##### Example

```ts
true
```

#### rebaseable?

> `optional` **rebaseable**: `boolean` \| `null`

##### Example

```ts
true
```

#### mergeable\_state

> **mergeable\_state**: `string`

##### Example

```ts
clean
```

#### merged\_by

> **merged\_by**: \{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \} \| `null`

##### Type Declaration

\{ `name?`: `string` \| `null`; `email?`: `string` \| `null`; `login`: `string`; `id`: `number`; `node_id`: `string`; `avatar_url`: `string`; `gravatar_id`: `string` \| `null`; `url`: `string`; `html_url`: `string`; `followers_url`: `string`; `following_url`: `string`; `gists_url`: `string`; `starred_url`: `string`; `subscriptions_url`: `string`; `organizations_url`: `string`; `repos_url`: `string`; `events_url`: `string`; `received_events_url`: `string`; `type`: `string`; `site_admin`: `boolean`; `starred_at?`: `string`; `user_view_type?`: `string`; \}

`null`

#### comments

> **comments**: `number`

##### Example

```ts
10
```

#### review\_comments

> **review\_comments**: `number`

##### Example

```ts
0
```

#### maintainer\_can\_modify

> **maintainer\_can\_modify**: `boolean`

##### Description

Indicates whether maintainers can modify the pull request.

##### Example

```ts
true
```

#### commits

> **commits**: `number`

##### Example

```ts
3
```

#### additions

> **additions**: `number`

##### Example

```ts
100
```

#### deletions

> **deletions**: `number`

##### Example

```ts
3
```

#### changed\_files

> **changed\_files**: `number`

##### Example

```ts
5
```

***

### number

> **number**: `number`

***

### type

> **type**: `"pull_request"`
