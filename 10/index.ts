import { inputAsStringArray, logAnswer } from '../helpers'

type Chunk = {
	start: string
	end: string
}

type Cursor = {
	position: number
	tail: string
}

class SyntaxError extends Error {
	public name = 'SyntaxError'
	public char: string

	constructor(expected: string, found: string) {
		super(`Expected ${expected}, but found ${found} instead.`)
		this.char = found
	}

	public get score(): number {
		switch (this.char) {
			case ')':
				return 3
			case ']':
				return 57
			case '}':
				return 1197
			case '>':
				return 25137
			default:
				return 0
		}
	}
}

const defaultCursor = (): Cursor => ({
	position: 0,
	tail: '',
})

const chunks: Chunk[] = [
	{ start: '(', end: ')' },
	{ start: '[', end: ']' },
	{ start: '{', end: '}' },
	{ start: '<', end: '>' },
]

const isEndChar = (char: string): boolean => {
	return chunks.some((chunk) => char === chunk.end)
}

const walkChunk = (line: string, cursor: Cursor = defaultCursor()): Cursor => {
	const start = line[cursor.position]
	const chunk = chunks.find((chunk) => chunk.start === start)
	if (!chunk) throw new Error(`Invalid chunk: ${start}`)

	const localCursor = { position: cursor.position + 1, tail: cursor.tail }

	while (localCursor.position <= line.length - 1) {
		const next = line[localCursor.position]
		if (next === chunk.end) {
			localCursor.position += 1
			return localCursor
		} else if (isEndChar(next)) {
			throw new SyntaxError(chunk.end, next)
		} else {
			const innerCursor = walkChunk(line, localCursor)
			localCursor.position = innerCursor.position
			localCursor.tail = innerCursor.tail + localCursor.tail
		}
	}

	// Didn't find the end of this chunk
	localCursor.tail += chunk.end
	return localCursor
}

const walkLine = (line: string): Cursor => {
	let cursor = defaultCursor()
	while (cursor.position <= line.length - 1) {
		cursor = walkChunk(line, cursor)
	}
	return cursor
}

// const testLines = inputAsStringArray(__dirname, 'test.txt')
const lines = inputAsStringArray(__dirname, 'input.txt')

// Part A
const calculateCorruptErrorScore = (lines: string[]): number => {
	let score = 0
	for (const line of lines) {
		try {
			walkLine(line)
		} catch (err) {
			if (err instanceof SyntaxError) {
				score += err.score
			}
		}
	}
	return score
}

logAnswer('A', calculateCorruptErrorScore(lines))

// Part B
const getCharScore = (char: string): number => {
	switch (char) {
		case ')':
			return 1
		case ']':
			return 2
		case '}':
			return 3
		case '>':
			return 4
		default:
			return 0
	}
}

const calculateAutocompleteScore = (cursor: Cursor): number => {
	return cursor.tail.split('').reduce((acc, char) => {
		return acc * 5 + getCharScore(char)
	}, 0)
}

const findMedianAutocompleteScore = (lines: string[]): number => {
	const scores = lines.reduce<number[]>((acc, line) => {
		try {
			acc.push(calculateAutocompleteScore(walkLine(line)))
		} catch (err) {
			// Do nothing
		}
		return acc
	}, [])

	// Sort scores and return median
	scores.sort((a, b) => a - b)
	const median = Math.floor(scores.length / 2)
	return scores[median]
}

logAnswer('B', findMedianAutocompleteScore(lines))
