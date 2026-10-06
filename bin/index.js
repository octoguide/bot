#!/usr/bin/env node

import { cli } from "../lib/cli.js";

const output = await cli(...process.argv.slice(2));

if (output !== undefined) {
	console.log(output);
}
