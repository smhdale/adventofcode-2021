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

const countElement = (
	element: string,
	record: ElementRecord
): ElementRecord => {
	const newRecord = { ...record }
	if (element in newRecord) newRecord[element]
	else newRecord[element] = 1
	return newRecord
}

const growPolymerPair = (
	pair: string,
	rules: InsertMap,
	record: ElementRecord,
	depth: number
): ElementRecord => {
	const element = rules.get(pair)
	if (!element) return { ...record }

	// Insert and record new element
	let localRecord = countElement(element, record)
	if (element in localRecord) localRecord[element]++
	else localRecord[element] = 1

	// End here if reached maximum depth
	if (depth < 1) return localRecord

	// Grow both new sub-polymers
	const [a, b] = pair.split('')
	localRecord = growPolymerPair(`${a}${element}`, rules, localRecord, depth - 1)
	localRecord = growPolymerPair(`${element}${b}`, rules, localRecord, depth - 1)
	return localRecord
}

const traversePolymer = (input: Input, depth: number): ElementRecord => {
	let record: ElementRecord = input.polymer.split('').reduce((acc, element) => {
		return countElement(element, acc)
	}, {})

	for (let i = 0; i < input.polymer.length - 1; i++) {
		const pair = input.polymer.substr(i, 2)
		record = growPolymerPair(pair, input.rules, record, depth)
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
