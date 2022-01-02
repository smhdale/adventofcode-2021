import { inputAsNumberGrid, logTest, logAnswer } from '../helpers'

const testGrid = inputAsNumberGrid(__dirname, 'test.txt')
const grid = inputAsNumberGrid(__dirname, 'input.txt')

type TCell = {
	id: number
	risk: number
	x: number
	y: number
}

type DistanceMap = Map<number, number>

interface IChitonGrid {
	width: number
	height: number
	cells: TCell[]
	getCell(x: number, y: number): TCell | null
	getNeighbours(cell: TCell): TCell[]
}

const createChitonGrid = (inputGrid: number[][]): IChitonGrid => {
	const width = inputGrid[0].length
	const height = inputGrid.length
	const cells: TCell[] = []

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const id = y * width + x
			const cell = { id, x, y, risk: inputGrid[y][x] }
			cells.push(cell)
		}
	}

	return {
		width,
		height,
		cells,
		getCell(x: number, y: number) {
			if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null
			return this.cells[y * this.width + x]
		},
		getNeighbours({ x, y }: TCell) {
			return [
				this.getCell(x, y - 1),
				this.getCell(x - 1, y),
				this.getCell(x + 1, y),
				this.getCell(x, y + 1),
			].filter((maybeCell): maybeCell is TCell => maybeCell !== null)
		},
	}
}

// Part A

const pathfind = (grid: IChitonGrid): number => {
	// Start with infinite distance to every node
	// (except distance of 0 for starting node)
	const distances: DistanceMap = new Map()
	const unvisited: Set<number> = new Set()
	const total = grid.cells.length

	for (let i = 0; i < grid.cells.length; i++) {
		distances.set(i, i ? Infinity : 0)
		if (i) unvisited.add(i)
	}

	// Set starting node
	let node = grid.cells[0]
	const targetId = grid.width * grid.height - 1

	while (unvisited.size) {
		// Get distance to current node
		const distanceSoFar = distances.get(node.id) || 0

		// End early if we find target node
		if (node.id === targetId) return distanceSoFar

		// Find unvisited neighbours
		const unvisitedNeighbours = grid
			.getNeighbours(node)
			.filter((cell) => unvisited.has(cell.id))

		// Update distance to all unvisited neighbours
		for (const n of unvisitedNeighbours) {
			const currentDistance = distances.get(n.id) || Infinity
			const thisDistance = distanceSoFar + n.risk
			if (thisDistance < currentDistance) {
				distances.set(n.id, thisDistance)
			}
		}

		// Mark current node as visited and find next node
		unvisited.delete(node.id)

		const [next, ...rest] = [...unvisited]
		node = grid.cells[next]

		for (const id of rest) {
			const nextDistance = distances.get(node.id) || Infinity
			const pathDistance = distances.get(id) || Infinity
			if (pathDistance < nextDistance) node = grid.cells[id]
		}
	}

	return distances.get(targetId) || -1
}

logTest('A', pathfind(createChitonGrid(testGrid)))
logAnswer('A', pathfind(createChitonGrid(grid)))

// Part B

const createRepeatingChitonGrid = (
	inputGrid: number[][],
	scale = 5
): IChitonGrid => {
	const width = inputGrid[0].length
	const height = inputGrid.length
	const cells: TCell[] = []

	const addCell = (x: number, y: number, risk: number): void => {
		const id = y * (width * scale) + x
		cells.push({ id, x, y, risk })
	}

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const baseRisk = inputGrid[y][x]

			for (let dx = 0; dx < scale; dx++) {
				const cellX = x + dx * width
				const riskX = (baseRisk + dx) % 9 || 9
				for (let dy = 0; dy < scale; dy++) {
					const cellY = y + dy * height
					const risk = (riskX + dy) % 9 || 9
					addCell(cellX, cellY, risk)
				}
			}
		}
	}

	return {
		width: width * scale,
		height: height * scale,
		cells,
		getCell(x: number, y: number) {
			if (x < 0 || x >= this.width || y < 0 || y >= this.height) return null
			return this.cells[y * this.width + x]
		},
		getNeighbours({ x, y }: TCell) {
			return [
				this.getCell(x, y - 1),
				this.getCell(x - 1, y),
				this.getCell(x + 1, y),
				this.getCell(x, y + 1),
			].filter((maybeCell): maybeCell is TCell => maybeCell !== null)
		},
	}
}

logTest('B', pathfind(createRepeatingChitonGrid(testGrid, 2)))
logAnswer('B', pathfind(createRepeatingChitonGrid(grid, 2)))
