import { isCommentMeaningless } from "is-comment-meaningless";

import type { Rule } from "../types/rules.js";

export const commentMeaningless = {
	about: {
		config: "strict",
		description: "Comments should be meaningful, not just '+1'-style bumps.",
		explanation: [
			`Posting replies containing just _"+1"_, _any update?"_, or other phrases without new information don't meaningfully contribute to a discussion.`,
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
			secondary: [
				"Although your enthusiasm is appreciated, posting a new comment gives everyone subscribed to the thread.",
				`It's generally better to give a GitHub emoji reaction instead.`,
			],
		});
	},
} satisfies Rule;
