import { inputAsStringArray, logAnswer } from '../helpers'

// Setup
// const test = inputAsStringArray(__dirname, 'test.txt')
const input = inputAsStringArray(__dirname, 'input.txt')

// Part A
type PowerReadings = {
	gamma: number
	epsilon: number
}

const resolveOnFrequencies = (lines: string[]): number[] => {
	const length = lines[0].length
	return lines.reduce(
		(acc, line) => {
			line.split('').forEach((bit, index) => {
				acc[index] += Number(bit === '1')
			})
			return acc
		},
		Array.from({ length }).map(() => 0)
	)
}

const resolvePowerReadings = (lines: string[]): PowerReadings => {
	const count = lines.length
	const freqs = resolveOnFrequencies(lines)

	let gamma = ''
	let epsilon = ''

	for (const freq of freqs) {
		const mostFreqIs1 = freq >= count / 2
		gamma += mostFreqIs1 ? '1' : '0'
		epsilon += mostFreqIs1 ? '0' : '1'
	}

	return {
		gamma: parseInt(gamma, 2),
		epsilon: parseInt(epsilon, 2),
	}
}

const { gamma, epsilon } = resolvePowerReadings(input)
logAnswer('A', gamma * epsilon)

// Part B
type LifeSupportReadings = {
	oxygen: number
	scrubber: number
}

type GateResolver = (freq: number, threshold: number) => '0' | '1'

const gatedFilter = (
	lines: string[],
	resolveGate: (freq: number, threshold: number) => '0' | '1'
): number => {
	let options = lines.slice()
	const positions = lines[0].length

	for (let i = 0; i < positions; i++) {
		// Determine if on or off state should be used to filter options
		const freqs = resolveOnFrequencies(options)
		const gate = resolveGate(freqs[i], options.length / 2)

		// Apply filter and continue if needed
		options = options.filter((line) => line[i] === gate)
		if (options.length < 2) break
	}

	return parseInt(options[0], 2)
}

const resolveLifeSupportReadings = (lines: string[]): LifeSupportReadings => {
	const oxyGate: GateResolver = (freq, thresh) => (freq >= thresh ? '1' : '0')
	const scrGate: GateResolver = (freq, thresh) => (freq < thresh ? '1' : '0')
	return {
		oxygen: gatedFilter(lines, oxyGate),
		scrubber: gatedFilter(lines, scrGate),
	}
}

const { oxygen, scrubber } = resolveLifeSupportReadings(input)
logAnswer('B', oxygen * scrubber)
