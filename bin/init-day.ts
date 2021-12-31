#!/usr/bin/env ts-node-script

import { existsSync, mkdirSync, openSync, closeSync } from 'fs'
import { resolve } from 'path'

const day = (process.argv[2] || '').padStart(2, '0')
const test = ['-t', '--test', '--with-test'].includes(process.argv[3])
const dir = resolve(__dirname, '..', day)

if (existsSync(dir)) {
	console.log(`Day ${day} exists; nothing to do.`)
	process.exit(0)
}

// Create directory and files for given day
const touchSync = (file: string) => closeSync(openSync(file, 'w'))
mkdirSync(dir)
touchSync(resolve(dir, 'index.ts'))
touchSync(resolve(dir, 'input.txt'))
if (test) touchSync(resolve(dir, 'test.txt'))
