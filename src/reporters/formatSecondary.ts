export function formatSecondary(secondary: string[] | undefined) {
	return (secondary ?? [])
		.flatMap((line) => line.split("\n"))
		.map((line) => `  ${line}`);
}
