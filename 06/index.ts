import { input, logAnswer } from '../helpers'

// Setup
const getInitialConditions = (file: string) =>
	input(__dirname, file).split(',').map(Number)
const initialConditions = getInitialConditions('input.txt')

// Part A

type LanternfishLifecycle = {
	isChild: boolean
	childhoodDays: number
	reproduceDays: number
	cycleDay: number
}

interface ILanternfish {
	daysUntilSpawn: number
	willSpawn: boolean
	liveDay(): void
}

class Lanternfish implements ILanternfish {
	private isChild: boolean
	private childhoodDays: number
	private reproduceDays: number
	public cycleDay: number

	constructor(lifecycle: Partial<LanternfishLifecycle> = {}) {
		this.isChild = lifecycle.isChild ?? true
		this.childhoodDays = lifecycle.childhoodDays ?? 2
		this.reproduceDays = lifecycle.reproduceDays ?? 7
		this.cycleDay = lifecycle.cycleDay ?? this.cycleLength - 1
	}

	private get cycleLength(): number {
		return this.reproduceDays + (this.isChild ? this.childhoodDays : 0)
	}

	public get daysUntilSpawn(): number {
		return this.cycleDay
	}

	public get willSpawn(): boolean {
		return this.cycleDay === this.cycleLength - 1
	}

	public liveDay(): void {
		if (this.cycleDay > 0) {
			this.cycleDay--
		} else {
			if (this.isChild) this.isChild = false
			this.cycleDay = this.cycleLength - 1
		}
	}
}

/**
 * Takes a set of initial fish lifecycles and simulates their growth for a given
 * number of days, returning the number of fish at the end of the last day.
 */
function simulateLanternfishSchool(
	initialState: number[],
	days: number
): number {
	const school = initialState.map(
		(cycleDay) => new Lanternfish({ cycleDay, isChild: false })
	)

	const tick = () => {
		const newFish = []
		for (const fish of school) {
			fish.liveDay()
			if (fish.willSpawn) newFish.push(new Lanternfish())
		}
		if (newFish.length) school.push(...newFish)
	}

	// Simulate the school of fish
	for (let i = 0; i < days; i++) tick()
	return school.length
}

logAnswer('A', simulateLanternfishSchool(initialConditions, 80))

// Part B

// We can't fit the number of fish into an array without running out of memory,
// so we need a more efficient solution

function efficientlySimulateLanternfishSchool(
	initialConditions: number[],
	days: number
): number {
	const cycleLength = 7
	const childhoodLength = 2

	// Track spawns per day of cycle
	const spawnsPerDay = initialConditions.reduce((acc, cycleDay) => {
		acc[cycleDay] += 1
		return acc
	}, Array(cycleLength).fill(0))

	// Track children to add to spawn pool
	const children = Array(cycleLength).fill(0)

	let day = 0
	let schoolSize = initialConditions.length

	while (day < days) {
		const dayOfCycle = day % cycleLength
		const spawns = spawnsPerDay[dayOfCycle]

		// Add pending children to cycle
		if (children[dayOfCycle] > 0) {
			spawnsPerDay[dayOfCycle] += children[dayOfCycle]
			children[dayOfCycle] = 0
		}

		// Increase school size and add children
		schoolSize += spawns
		children[(dayOfCycle + childhoodLength) % cycleLength] += spawns

		day++
	}

	return schoolSize
}

logAnswer('B', efficientlySimulateLanternfishSchool(initialConditions, 256))
