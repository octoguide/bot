#!/usr/bin/env node

import { cli } from "../lib/cli.js";

console.log(await cli(...process.argv.slice(2)));
