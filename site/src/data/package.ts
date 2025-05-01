import fs from "node:fs";

const packageData = JSON.parse(
	fs.readFileSync(new URL("../../../package.json", import.meta.url), "utf-8"),
) as typeof import("../../../package.json");

export const { version } = packageData;
