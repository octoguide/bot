import type { EntityEditor } from "../types/entities.js";
import type { RuleOptions } from "../types/rules.js";

/**
 * Checks whether a rule's options exclude someone who edited another user's entity.
 * @remarks Editing another user's entity requires write access, so a human
 * editor's association is either `OWNER` or else `COLLABORATOR` or `MEMBER`.
 * GitHub doesn't provide editors' associations, so the latter two are
 * treated as equivalent.
 * Bot editors are only checked against `include-bots`.
 */
export function isRuleSkippedForEditor(
	editor: EntityEditor,
	repositoryOwner: string,
	options: RuleOptions,
) {
	if (editor.type === "Bot") {
		return !options["include-bots"];
	}

	const associations = options["include-associations"];
	if (!associations) {
		return false;
	}

	return editor.login === repositoryOwner
		? !associations.has("OWNER")
		: !associations.has("COLLABORATOR") && !associations.has("MEMBER");
}
