const defaultIncludeAssociations = new Set([
	"CONTRIBUTOR",
	"FIRST_TIME_CONTRIBUTOR",
	"FIRST_TIMER",
	"NONE",
]);

export function parseIncludeAssociations(raw: string) {
	if (!raw) {
		return defaultIncludeAssociations;
	}

	return new Set([
		"NONE",
		...raw
			.split(",")
			.map((a) => a.trim())
			.filter((a) => a.length > 0),
	]);
}
