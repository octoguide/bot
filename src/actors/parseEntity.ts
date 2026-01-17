/**
 * Parses a GitHub entity URL to determine the entity type and number.
 * @param url The GitHub entity URL (e.g., https://github.com/owner/repo/issues/123)
 * @returns Array with [urlType, numberStr], or null if URL doesn't match pattern
 */
export function parseEntityUrl(url: string) {
	return /(discussions|issues|pull)\/(\d+)/.exec(url)?.slice(1);
}

/**
 * Parses a GitHub comment URL to extract the comment ID.
 * Matches issue comments (#issuecomment-123), discussion comments (#discussioncomment-456),
 * and pull request review comments (#discussion_r123).
 * @param url The GitHub comment URL
 * @returns The comment ID as a string, or undefined if URL doesn't contain a comment
 */
export function parseCommentId(url: string): string | undefined {
	return /#(?:(?:discussion|issue)comment-|discussion_r)(\d+)/.exec(url)?.[1];
}
