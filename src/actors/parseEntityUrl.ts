/**
 * Parses a GitHub entity URL to determine the entity type and number.
 * @param url The GitHub entity URL (e.g., https://github.com/owner/repo/issues/123)
 * @returns Array matching regex exec format [fullMatch, urlType, numberStr], or null if URL doesn't match pattern
 */
export function parseEntityUrl(url: string) {
	return /(discussions|issues|pull)\/(\d+)/.exec(url);
}
