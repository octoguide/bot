import parseGitHubUrl from "parse-github-url";

export function resolveLocator(url: string) {
	const parsed = parseGitHubUrl(url);
	if (!parsed?.owner || !parsed.name) {
		return undefined;
	}

	return {
		owner: parsed.owner,
		repository: parsed.name,
	};
}
