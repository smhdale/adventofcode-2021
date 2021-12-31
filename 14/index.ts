import { inputAsGroupedStringArray, logTest, logAnswer } from '../helpers'

type Input = {
	polymer: string
	rules: InsertMap
}
type InsertMap = Map<string, string>
type ElementRecord = Record<string, number>

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

const countElements = (polymer: string): ElementRecord => {
	const record: ElementRecord = {}
	for (let i = 0; i < polymer.length; i++) {
		const element = polymer[i]
		if (element in record) record[element]++
		else record[element] = 1
	}
	return record
}

const growPolymer = (polymer: string, rules: InsertMap): string => {
	let newPolymer = polymer[0]
	let cursor = 1
	while (cursor < polymer.length) {
		const pair = polymer.substr(cursor - 1, 2)
		const insert = rules.get(pair)
		if (insert) newPolymer += insert
		newPolymer += pair[1]
		cursor++
	}
	return newPolymer
}

const updatePolymer = (input: Input, steps: number): ElementRecord => {
	let polymer = input.polymer
	for (let i = 0; i < steps; i++) polymer = growPolymer(polymer, input.rules)
	return countElements(polymer)
}

// Part A

const getElementDifference = (record: ElementRecord): number => {
	const amounts = Object.values(record)
	return Math.max(...amounts) - Math.min(...amounts)
}

const testRecordA = updatePolymer(testInput, 10)
const testDifferenceA = getElementDifference(testRecordA)
logTest('A', testDifferenceA)

const recordA = updatePolymer(input, 10)
const differenceA = getElementDifference(recordA)
logAnswer('A', differenceA)

// Part B

const recordB = updatePolymer(input, 40)
const differenceB = getElementDifference(recordB)
logAnswer('B', differenceB)
