import type * as github from "@actions/github";

import * as core from "@actions/core";

import type { Entity } from "../types/entities.js";

import { runOctoGuideRules } from "../index.js";
import { cliReporter } from "../reporters/cliReporter.js";
import { attributeEditReports } from "./attributeEditReports.js";
import { collectAuth } from "./collection/collectAuth.js";
import { collectEdit } from "./collection/collectEdit.js";
import { collectEntityInput } from "./collection/collectEntityInput.js";
import { collectSettings } from "./collection/collectSettings.js";
import { collectTarget } from "./collection/collectTarget.js";
import { outputActionReports } from "./comments/outputActionReports.js";
import { runCommentCleanup } from "./runCommentCleanup.js";

export async function runOctoGuideAction(context: typeof github.context) {
	const { payload } = context;
	const { target, url } = collectTarget(payload);
	if (!url) {
		return;
	}

	const auth = collectAuth();

	if (payload.action === "deleted") {
		await runCommentCleanup({ auth, payload, url });
		return;
	}

	const entityInput = collectEntityInput(payload, target, url);
	const settings = collectSettings();
	const edit = collectEdit(payload, entityInput);

	const runRules = (entity: Entity) =>
		runOctoGuideRules({ auth, editor: edit?.editor, entity, settings });

	const [{ actor, entity, reports: allReports }, previous] = await Promise.all([
		runRules(entityInput),
		edit && runRules(edit.previous),
	]);

	const { logins, reports } =
		edit && previous
			? attributeEditReports({
					editor: edit.editor,
					entity,
					previousReports: previous.reports,
					reports: allReports,
					repositoryOwner: context.repo.owner,
					settings,
				})
			: { logins: undefined, reports: allReports };

	if (reports.length < allReports.length) {
		core.info(
			`Ignoring ${allReports.length - reports.length} report(s) from rules that exclude whoever caused them.`,
		);
	}

	if (reports.length) {
		core.info(`Found ${reports.length} report(s).`);
		console.log(cliReporter(reports));
	} else {
		core.info("Found 0 reports. Great! ✅");
	}

	await outputActionReports(actor, entity, reports, settings, logins);
}
