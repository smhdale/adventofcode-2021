import { inputAsNumberGrid, logAnswer } from '../helpers'

// const testRows = inputAsNumberGrid(__dirname, 'test.txt')
const rows = inputAsNumberGrid(__dirname, 'input.txt')

type Octopus = {
	energy: number
	flashed: boolean
}

class OctopusGrid {
	private grid: Octopus[][]
	public flashes = 0

	constructor(rows: number[][]) {
		// Init octopus grid
		this.grid = rows.map((row) => {
			return row.map((energy) => ({ energy, flashed: false }))
		})
	}

	private get width(): number {
		return this.grid[0].length
	}

	private get height(): number {
		return this.grid.length
	}

	private getCell(x: number, y: number): Octopus | null {
		return this.grid[y]?.[x] || null
	}

	private eachCell(cb: (x: number, y: number) => void): void {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				cb(x, y)
			}
		}
	}

	private increaseEnergy(): void {
		this.eachCell((x, y) => {
			const octopus = this.getCell(x, y)
			if (octopus) octopus.energy++
		})
	}

	private flashOctopi(): void {
		while (true) {
			let anyPendingFlash = false

			this.eachCell((x, y) => {
				const octopus = this.getCell(x, y)
				if (octopus && OctopusGrid.shouldFlash(octopus)) {
					// Flash this octopus
					octopus.flashed = true
					this.flashes++

					// Increase energy of neighbours
					for (let j = -1; j < 2; j++) {
						for (let i = -1; i < 2; i++) {
							if (i || j) {
								const neighbour = this.getCell(x + i, y + j)
								if (neighbour) {
									neighbour.energy++
									if (OctopusGrid.shouldFlash(neighbour)) {
										anyPendingFlash = true
									}
								}
							}
						}
					}
				}
			})

			if (!anyPendingFlash) break
		}
	}

	private resetEnergy(): void {
		this.eachCell((x, y) => {
			const octopus = this.getCell(x, y)
			if (octopus && octopus.flashed) {
				octopus.energy = 0
				octopus.flashed = false
			}
		})
	}

	public tick(): void {
		this.increaseEnergy()
		this.flashOctopi()
		this.resetEnergy()
	}

	public simulate(steps = 1): void {
		let step = 0
		while (step++ < steps) this.tick()
	}

	public simulateUntilSync(): number {
		let step = 0
		while (true) {
			const flashesBeforeStep = this.flashes
			this.simulate()
			step++

			const flashesThisStep = this.flashes - flashesBeforeStep
			if (flashesThisStep >= this.width * this.height) return step
		}
	}

	private static shouldFlash(octopus: Octopus): boolean {
		return octopus.energy > 9 && !octopus.flashed
	}
}

// Part A
const gridA = new OctopusGrid(rows)
gridA.simulate(100)
logAnswer('A', gridA.flashes)

// Part B
const gridB = new OctopusGrid(rows)
const stepsUntilSync = gridB.simulateUntilSync()
logAnswer('B', stepsUntilSync)
