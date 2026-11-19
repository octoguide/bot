#!/usr/bin/env node

import { cli } from "../lib/cli.js";

await cli(...process.argv.slice(2));
