---
editUrl: false
next: false
prev: false
title: "Entity"
---

> **Entity** = [`CommentEntity`](/generated/api/interfaces/commententity/) \| [`DiscussionEntity`](/generated/api/interfaces/discussionentity/) \| [`IssueEntity`](/generated/api/interfaces/issueentity/) \| [`PullRequestEntity`](/generated/api/interfaces/pullrequestentity/)

A resolved entity retrieved from the GitHub API.
Can be a comment, discussion, issue, or pull request.

Each entity contains:
- `data`: The direct data returned from the GitHub API
- `type`: The type of entity, indicating what `data` contains:
  - `"comment"`: [issue/PR comment](https://docs.github.com/en/rest/issues/comments) or [discussion comment](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussioncomment)
  - `"discussion"`: [discussion data](https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions#discussion)
  - `"issue"`: [issue data](https://docs.github.com/en/rest/issues/issues#get-an-issue)
  - `"pull_request"`: [pull request data](https://docs.github.com/en/rest/pulls/pulls#get-a-pull-request)
