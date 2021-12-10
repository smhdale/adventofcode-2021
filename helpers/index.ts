import { readFileSync } from 'fs'
import { resolve } from 'path'
import chalk from 'chalk'

// File I/O

export function input(...paths: string[]): string {
	const target = resolve(...paths)
	return String(readFileSync(target))
}

export function inputAsStringArray(...paths: string[]): string[] {
	return input(...paths)
		.trim()
		.split(/\r?\n/)
}

export function inputAsNumberArray(...paths: string[]): number[] {
	return inputAsStringArray(...paths).map(Number)
}

// String array grouped by blank lines
export function inputAsGroupedStringArray(...paths: string[]): string[][] {
	const array = inputAsStringArray(...paths)
	const groups = []
	let group = []
	const finaliseGroup = () => {
		groups.push([...group])
		group = []
	}
	for (const line of array) {
		if (line) group.push(line)
		else finaliseGroup()
	}
	if (group.length) finaliseGroup()
	return groups
}

// Counting & enumeration

export function clamp(n: number, min: number, max: number): number {
	return Math.max(min, Math.min(n, max))
}

export function sumEach<T>(
	array: T[],
	condition: (item: T) => boolean | number
): number {
	return array.reduce((acc, item) => acc + Number(condition(item)), 0)
}

export function everyPair<T>(array: T[]): [T, T][] {
	const pairs = []
	const length = array.length
	if (length < 2) return
	for (let i = 0; i < length - 1; i++) {
		for (let j = i + 1; j < length; j++) {
			pairs.push([array[i], array[j]])
		}
	}
	return pairs
}

export type FixedArray<T, L extends number, TObj = [T, ...Array<T>]> = TObj & {
	readonly length: L
}

export function multiEnumerate<L extends number>(
	ranges: FixedArray<[number, number], L>
) {
	let combos = []
	for (const [min, max] of ranges) {
		const newCombos = []
		for (let i = min; i <= max; i++) {
			if (combos.length) newCombos.push(...combos.map((c) => [...c, i]))
			else newCombos.push([i])
		}
		combos = newCombos
	}
	return combos as FixedArray<number, L>[]
}

// Trigonometry

export function toPolar(x: number, y: number): { r: number; theta: number } {
	const r = (x ** 2 + y ** 2) ** 0.5
	const theta = Math.atan2(y, x)
	return { r, theta }
}

export function toCartesian(
	r: number,
	theta: number
): { x: number; y: number } {
	const x = r * Math.cos(theta)
	const y = r * Math.sin(theta)
	return { x, y }
}

// Object handling

export function clone<T>(input: T): T {
	return JSON.parse(JSON.stringify(input))
}

// Logging

export function logTest(part: 'A' | 'B', ...logs: any[]) {
	console.log(chalk.grey(`Part ${part} test case answer:`))
	console.log(...logs)
	console.log()
}

export function logAnswer(part: 'A' | 'B', ...logs: any[]) {
	console.log(chalk.green(`Part ${part} answer:`))
	console.log(...logs)
	console.log()
}
