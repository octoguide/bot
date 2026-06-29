import type * as github from "@actions/github";

import * as core from "@actions/core";

import { EntityData } from "../../types/entities";

export function collectTarget(
	payload: Partial<(typeof github.context)["payload"]>,
) {
	core.debug(`Full target payload: ${JSON.stringify(payload, null, 2)}`);

	if (!payload.action) {
		core.info("Unknown payload action. Exiting.");
		return {};
	}

	const target = (payload.comment ??
		payload.discussion ??
		payload.issue ??
		payload.pull_request) as EntityData | undefined;
	if (!target) {
		throw new Error("Could not determine an entity to run OctoGuide/bot on.");
	}

	const url = target.html_url;
	if (typeof url !== "string") {
		throw new Error("Target entity's html_url is not a string.");
	}

	core.info(`Targeting ${payload.action} entity at html_url: ${url}`);

	return { target, url };
}
