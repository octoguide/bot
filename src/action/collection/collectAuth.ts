import * as core from "@actions/core";

export function collectAuth() {
	const auth = core.getInput("github-token") || process.env.GITHUB_TOKEN;
	if (!auth) {
		throw new Error("Please provide a with.github-token to OctoGuide/bot.");
	}

	return auth;
}
