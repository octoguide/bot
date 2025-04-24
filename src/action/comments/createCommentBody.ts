export function createCommentBody(message: string): string {
	return [
		message,
		"---",
		`🗺️ This message posted automatically by [OctoGuide](https://github.com/JoshuaKGoldberg/OctoGuide)`,
	].join("\n\n");
}
