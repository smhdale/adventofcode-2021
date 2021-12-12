import { inputAsNumberCSV, logAnswer } from '../helpers'

// Setup
const positions = inputAsNumberCSV(__dirname, 'input.txt')

const getFuelUsage = (
	positions: number[],
	endPosition: number,
	stepped = false
) => {
	return positions.reduce((acc, pos) => {
		const steps = Math.abs(pos - endPosition)
		return acc + (stepped ? (steps * (steps + 1)) / 2 : steps)
	}, 0)
}

const getLowestFuelUsage = (positions: number[], stepped = false): number => {
	const min = Math.min(...positions)
	const max = Math.max(...positions)
	let leastFuel = Infinity
	for (let i = min; i <= max; i++) {
		const usage = getFuelUsage(positions, i, stepped)
		if (usage < leastFuel) leastFuel = usage
	}
	return leastFuel
}

logAnswer('A', getLowestFuelUsage(positions))
logAnswer('B', getLowestFuelUsage(positions, true))
