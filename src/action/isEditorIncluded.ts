import type { RuleOptionsRaw } from "../types/rules.js";
import type { Editor } from "./collection/collectEditor.js";

/**
 * Checks whether settings include someone who edited another user's entity.
 * @remarks Editing another user's entity requires write access, so a human
 * editor's association is either `OWNER` or else `COLLABORATOR` or `MEMBER`.
 * GitHub doesn't provide editors' associations, so the latter two are
 * treated as equivalent.
 */
export function isEditorIncluded(
	editor: Editor,
	repositoryOwner: string,
	options: RuleOptionsRaw = {},
) {
	if (editor.type === "Bot") {
		return options["include-bots"] ?? true;
	}

	const associations = options["include-associations"];
	if (!associations) {
		return true;
	}

	return editor.login === repositoryOwner
		? associations.includes("OWNER")
		: associations.includes("COLLABORATOR") || associations.includes("MEMBER");
}
