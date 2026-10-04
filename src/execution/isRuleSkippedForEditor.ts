import type { Entity, EntityEditor } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

import { isRuleSkippedForUser } from "./isRuleSkippedForUser.js";

/**
 * Checks whether a rule's options exclude someone's edit to another user's entity.
 */
export function isRuleSkippedForEditor(
	editor: EntityEditor,
	entity: Entity,
	repositoryOwner: string,
	options: RuleOptions,
) {
	const { user: author } = entity.data;
	if (author && isRuleSkippedForUser(author, options)) {
		return true;
	}

	if (editor.type === "Bot") {
		return isRuleSkippedForUser(editor, options);
	}

	const associations = options["include-associations"];
	if (!associations) {
		return false;
	}

	return editor.login === repositoryOwner
		? !associations.has("OWNER")
		: !associations.has("COLLABORATOR") && !associations.has("MEMBER");
}
