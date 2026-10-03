import type { Entity, EntityEditor } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

import { isRuleSkippedForUser } from "./isRuleSkippedForUser.js";

/**
 * Checks whether a rule's options exclude someone's edit to another user's entity.
 * @remarks Entities whose authors are excluded bots stay skipped, whoever edits them.
 * Otherwise, the editor is checked in place of the author.
 * Editing another user's entity requires write access, so a human
 * editor's association is either `OWNER` or else `COLLABORATOR` or `MEMBER`.
 * GitHub doesn't provide editors' associations, so the latter two are
 * treated as equivalent.
 * Bot editors are only checked by their account type.
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
