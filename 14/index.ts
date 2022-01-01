import { inputAsGroupedStringArray, logTest, logAnswer } from '../helpers'

type Input = {
	polymer: string
	rules: InsertMap
}

type InsertMap = Map<string, string>
type ElementRecord = Record<string, number>

interface IElement {
	symbol: string
	next: IElement | null
	pair: string | null
	insert(symbol: string): IElement
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

const createElement = (symbol: string): IElement => ({
	symbol,
	next: null,
	get pair() {
		return this.next ? this.symbol + this.next.symbol : null
	},
	insert(symbol: string) {
		const refNext = this.next
		this.next = createElement(symbol)
		if (refNext) this.next.next = refNext
		return this.next
	},
})

const createLinkedListPolymer = (polymer: string): IElement => {
	const [first, ...rest] = polymer.split('')
	const firstElem = createElement(first)
	let cursor = firstElem
	for (const symbol of rest) {
		cursor = cursor.insert(symbol)
	}
	return firstElem
}

const updateLinkedListPolymer = (
	firstElem: IElement,
	rules: InsertMap
): IElement => {
	let cursor: IElement | null = firstElem
	while (cursor?.pair) {
		const newSymbol = rules.get(cursor.pair)
		if (newSymbol) cursor = cursor.insert(newSymbol)
		cursor = cursor.next
	}
	return firstElem
}

const growLinkedListPolymer = (input: Input, steps: number): IElement => {
	const firstElem = createLinkedListPolymer(input.polymer)
	for (let i = 0; i < steps; i++) {
		updateLinkedListPolymer(firstElem, input.rules)
	}
	return firstElem
}

const countLinkedListPolymerElements = (firstElem: IElement): ElementRecord => {
	const record: ElementRecord = {}
	let cursor = firstElem
	while (cursor?.next) {
		const symbol = cursor.symbol
		if (symbol in record) record[symbol]++
		else record[symbol] = 1
		cursor = cursor.next
	}
	return record
}

const getElementDifference = (record: ElementRecord): number => {
	const amounts = Object.values(record)
	return Math.max(...amounts) - Math.min(...amounts)
}

const calculate = (input: Input, steps: number): number => {
	const polymer = growLinkedListPolymer(input, steps)
	const record = countLinkedListPolymerElements(polymer)
	return getElementDifference(record)
}

// Part A

logTest('A', calculate(testInput, 10))
logAnswer('A', calculate(input, 10))

// Part B

logTest('B', calculate(testInput, 40))
logAnswer('B', calculate(input, 40))
