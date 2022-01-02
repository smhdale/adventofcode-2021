import { inputAsGroupedStringArray, logTest, logAnswer } from '../helpers'

type Input = {
	polymer: string
	rules: InsertMap
}

type InsertMap = Map<string, string>
type PairRecordMap = Map<string, ElementRecord>
type ElementRecord = Record<string, number>

type GrowMeta = {
	rules: InsertMap
	records: PairRecordMap
}

const parseInput = (input: string[][]): Input => {
	const polymer = input[0][0]
	const rules: InsertMap = new Map()
	for (const rawRule of input[1]) {
		const [pair, insert] = rawRule.split(' -> ')
		rules.set(pair, insert)
	}
	return { polymer, rules }
}

const testInput = parseInput(inputAsGroupedStringArray(__dirname, 'test.txt'))
const input = parseInput(inputAsGroupedStringArray(__dirname, 'input.txt'))

const addElementToRecord = (
	record: ElementRecord,
	element: string,
	count = 1
): ElementRecord => {
	const newRecord = { ...record }
	if (element in newRecord) newRecord[element] += count
	else newRecord[element] = count
	return newRecord
}

const addRecords = (a: ElementRecord, b: ElementRecord): ElementRecord => {
	let c = { ...a }
	for (const [element, count] of Object.entries(b)) {
		c = addElementToRecord(c, element, count)
	}
	return c
}

const growPolymerPair = (
	pair: string,
	meta: GrowMeta,
	depth: number
): ElementRecord => {
	// If this pair at this depth has already been expanded, return the result
	const key = `${pair}.${depth}`
	const existing = meta.records.get(key)
	if (existing) return existing

	let record = {}
	const mergeIntoRecord = (other: ElementRecord): void => {
		record = addRecords(record, other)
	}

	const element = meta.rules.get(pair)
	if (element) {
		// Insert and record new element
		record = addElementToRecord(record, element)

		// Grow both new sub-polymers
		if (depth > 0) {
			const [a, b] = pair.split('')
			mergeIntoRecord(growPolymerPair(`${a}${element}`, meta, depth - 1))
			mergeIntoRecord(growPolymerPair(`${element}${b}`, meta, depth - 1))
		}
	}

	// Record this result for later use, then return it
	meta.records.set(key, record)
	return record
}

const traversePolymer = (input: Input, depth: number): ElementRecord => {
	let record: ElementRecord = input.polymer.split('').reduce((acc, element) => {
		return addElementToRecord(acc, element)
	}, {})
	const mergeIntoRecord = (other: ElementRecord): void => {
		record = addRecords(record, other)
	}

	const meta = {
		rules: input.rules,
		records: new Map(),
	}

	for (let i = 0; i < input.polymer.length - 1; i++) {
		const pair = input.polymer.substr(i, 2)
		mergeIntoRecord(growPolymerPair(pair, meta, depth))
	}

	return record
}

const getElementDifference = (record: ElementRecord): number => {
	const amounts = Object.values(record)
	return Math.max(...amounts) - Math.min(...amounts)
}

const calculate = (input: Input, steps: number): number => {
	const record = traversePolymer(input, steps - 1)
	return getElementDifference(record)
}

// Part A

logTest('A', calculate(testInput, 10))
logAnswer('A', calculate(input, 10))

// Part B

logTest('B', calculate(testInput, 40))
logAnswer('B', calculate(input, 40))
