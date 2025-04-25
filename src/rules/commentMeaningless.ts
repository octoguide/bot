import { isCommentMeaningless } from "is-comment-meaningless";

import type { Rule } from "../types/rules.js";

export const commentMeaningless = {
	about: {
		config: "strict",
		description: "Comments should be meaningful, not just '+1'-style bumps.",
		explanation: [
			`Replies containing just _"+1"_, _any update?"_, or other phrases without new information aren't helpful.`,
			`They cause unnecessary notifications for other contributors and take up space.`,
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
			primary: `Saying just _"${text}"_ is unnecessary; it doesn't add any new information to the discussion.`,
			suggestion: [
				`To resolve this report:`,
				`* If you have new information that'll help the discussion, edit it into the comment`,
				`* Otherwise, delete the comment and emoji react to the ${entity.parentType}`,
			],
		});
	},
} satisfies Rule;
