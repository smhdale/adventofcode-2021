#!/usr/bin/env ts-node-script

import { existsSync } from 'fs'
import { resolve } from 'path'

const day = (process.argv[2] || '').padStart(2, '0')
const dir = resolve(__dirname, '..', day)
const exe = resolve(dir, 'index.ts')

if (!existsSync(dir) || !existsSync(exe)) {
	console.log(`\nCouldn't find code for DAY ${day}, aborting.\n`)
	process.exit(0)
}

// Load and execute the day's code
const main = async () => {
	console.log(`\nRunning code for DAY ${day}...\n`)
	await require(exe)
}
main()
