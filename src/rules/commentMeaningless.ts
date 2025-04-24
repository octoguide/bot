import { isCommentMeaningless } from "is-comment-meaningless";

import type { Rule } from "../types/rules.js";

export const commentMeaningless = {
	about: {
		config: "strict",
		description: "Comments should be meaningful, not just '+1'-style bumps.",
		explanation: [
			`Replies containing just _"+1"_, _any update?"_, or other phrases without new information don't help in a discussion.`,
			`If done too much, they can even become disruptive to other contributors.`,
		],
		name: "comment-meaningless",
	},
	comment(context, entity) {
		const text = entity.data.body;
		if (!text || !isCommentMeaningless(text)) {
			return;
		}

		// TODO: tailor the messaging once we get a reason
		// https://github.com/JoshuaKGoldberg/is-comment-meaningless/issues/6
		context.report({
			primary: `Saying just '${text}' is unnecessary: it doesn't add any new information to the discussion.`,
		});
	},
} satisfies Rule;
