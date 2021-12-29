import { inputAsStringArray, logAnswer } from '../helpers'

const rows = inputAsStringArray(__dirname, 'input.txt').map((row) =>
	row.split('').map(Number)
)

class Cell {
	public x: number
	public y: number
	public value: number

	constructor(x: number, y: number, value: number) {
		this.x = x
		this.y = y
		this.value = value
	}

	public get key(): string {
		return [this.x, this.y].join(',')
	}

	public get risk(): number {
		return this.value + 1
	}

	public is(other: Cell): boolean {
		return this.x === other.x && this.y === other.y
	}
}

class Heightmap {
	private rows: number[][]

	constructor(rows: number[][]) {
		this.rows = rows
	}

	public get width(): number {
		return this.rows[0].length
	}

	public get height(): number {
		return this.rows.length
	}

	public getCell(x: number, y: number): Cell | null {
		const value = this.rows[y]?.[x]
		if (value === undefined) return null
		return new Cell(x, y, value)
	}

	public getNeighbours(x: number, y: number): Cell[] {
		return [
			this.getCell(x, y - 1),
			this.getCell(x - 1, y),
			this.getCell(x + 1, y),
			this.getCell(x, y + 1),
		].filter((cell): cell is Cell => cell !== null)
	}

	public eachCell(cb: (cell: Cell) => void) {
		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const cell = this.getCell(x, y)
				if (cell) cb(cell)
			}
		}
	}
}

const heightmap = new Heightmap(rows)

// Part A
const lowPoints: Cell[] = []
heightmap.eachCell((cell) => {
	const neighbours = heightmap.getNeighbours(cell.x, cell.y)
	if (neighbours.every((neighbour) => neighbour.value > cell.value)) {
		lowPoints.push(cell)
	}
})
const totalRiskOfLowPoints = lowPoints.reduce((acc, cell) => acc + cell.risk, 0)
logAnswer('A', totalRiskOfLowPoints)

// Part B
const basins: Cell[][] = lowPoints.map((cell) => [cell])

const findBasinIndex = (cell: Cell): number =>
	basins.findIndex((basin) => {
		return basin.some((other) => cell.is(other))
	})

const findLowestNeighbour = (cell: Cell): Cell => {
	return heightmap.getNeighbours(cell.x, cell.y).reduce((acc, cell) => {
		return cell.value < acc.value ? cell : acc
	})
}

heightmap.eachCell((cell) => {
	if (cell.value === 9) return

	// Flow downwards to lowest neighbour
	let basin = findBasinIndex(cell)
	if (basin > -1) return

	let flow = cell
	while (basin === -1) {
		flow = findLowestNeighbour(flow)
		basin = findBasinIndex(flow)
	}
	basins[basin].push(cell)
})

// Sort basins by size
basins.sort((a, b) => b.length - a.length)

// Find product of risk of largest 3 basins
const productOfSizeOfLargestBasins = basins.slice(0, 3).reduce((acc, basin) => {
	return acc * basin.length
}, 1)

logAnswer('B', productOfSizeOfLargestBasins)
