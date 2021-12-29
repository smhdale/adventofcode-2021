import { inputAsStringArray, logAnswer } from '../helpers'

type Character = {
	segments: string[]
	digit: number | null
}

type Sequence = {
	input: Character[]
	output: Character[]
}

const raw = inputAsStringArray(__dirname, 'input.txt')

const resolveDigit = (
	segments: string[],
	knownChars: Character[] = []
): number | null => {
	const containsAll = (superset: string[], subset: string[]): boolean => {
		return subset.every((seg) => superset.includes(seg))
	}
	const findDigit = (...options: number[]): Character | undefined => {
		return knownChars.find(
			({ digit }) => digit !== null && options.includes(digit)
		)
	}

	switch (segments.length) {
		case 2: {
			return 1
		}
		case 3: {
			return 7
		}
		case 4: {
			return 4
		}
		case 5: {
			const oneOrSeven = findDigit(1, 7)
			const nine = findDigit(9)
			if (oneOrSeven && containsAll(segments, oneOrSeven.segments)) {
				return 3
			} else if (nine && containsAll(nine.segments, segments)) {
				return 5
			}
			return 2
		}
		case 6: {
			const four = findDigit(4)
			const seven = findDigit(7)
			if (seven && !containsAll(segments, seven.segments)) {
				return 6
			} else if (four && containsAll(segments, four.segments)) {
				return 9
			}
			return 0
		}
		case 7: {
			return 8
		}
		default: {
			return null
		}
	}
}

const parseChar = (raw: string): Character => {
	const segments = raw.split('')
	const digit = resolveDigit(segments)
	return { segments, digit }
}

const parseLine = (raw: string): Sequence => {
	const [input, output] = raw.split(' | ').map((seq) => {
		return seq.split(' ').map(parseChar)
	})
	return { input, output }
}

const sequences = raw.map(parseLine)

// Part A
const uniques = [1, 4, 7, 8]
const uniqueDigitsInOutputs = sequences.reduce((acc, { output }) => {
	return (
		acc +
		output.reduce((acc, { digit }) => {
			return acc + Number(digit && uniques.includes(digit))
		}, 0)
	)
}, 0)

logAnswer('A', uniqueDigitsInOutputs)

// Part B
const resolveAllDigits = (sequence: Sequence): Character[] => {
	const resolveAny = (
		chars: Character[]
	): { chars: Character[]; didResolve: boolean } => {
		let didResolve = false
		const knownChars = chars.filter((char) => char.digit !== null)
		const newChars = []
		for (const char of chars) {
			const digit = resolveDigit(char.segments, knownChars)
			const newChar = { ...char, digit }
			if (digit !== null && knownChars.every((char) => char.digit !== digit)) {
				knownChars.push(newChar)
				if (!didResolve) didResolve = true
			}
			newChars.push(newChar)
		}
		return { chars: newChars, didResolve }
	}

	let chars = sequence.input
	let didResolve = true
	while (didResolve) {
		const result = resolveAny(chars)
		chars = result.chars
		didResolve = result.didResolve
	}

	return chars
}

const resolveCode = (sequence: Sequence): number => {
	const chars = resolveAllDigits(sequence)

	const resolveKnownDigit = (char: Character): number => {
		return (
			chars.find(
				(known) =>
					known.segments.length === char.segments.length &&
					known.segments.every((seg) => char.segments.includes(seg))
			)?.digit || 0
		)
	}

	return Number(
		sequence.output.reduce((acc, char) => {
			return acc + resolveKnownDigit(char)
		}, '')
	)
}

const sumOfAllCodes = sequences.reduce((acc, seq) => acc + resolveCode(seq), 0)
logAnswer('B', sumOfAllCodes)
