import { inputAsGroupedStringArray, logAnswer } from '../helpers'

type Coord = {
	x: number
	y: number
}

type Axis = 'x' | 'y'

type Fold = {
	axis: Axis
	coord: number
}

type Paper = {
	coords: Coord[]
	folds: Fold[]
}

const parseInput = ([rawCoords, rawFolds]: string[][]): Paper => {
	const coords: Coord[] = rawCoords.map((coord) => {
		const [x, y] = coord.split(',').map(Number)
		return { x, y }
	})

	const folds: Fold[] = rawFolds.map((fold) => {
		const [, axis, value] = fold.match(/(x|y)=(\d+)/) || []
		return { axis: axis as Axis, coord: Number(value) }
	})

	return { coords, folds }
}

// const testPaper = parseInput(inputAsGroupedStringArray(__dirname, 'test.txt'))
const paper = parseInput(inputAsGroupedStringArray(__dirname, 'input.txt'))

const asKey = (coord: Coord): string => `${coord.x},${coord.y}`

const countVisible = (coords: Coord[]): number => {
	return new Set(coords.map(asKey)).size
}

const foldValue = (value: number, fold: number): number | null => {
	if (value > fold) return fold - (value - fold)
	else if (value < fold) return value
	else return null
}

const foldCoord = ({ x, y }: Coord, fold: Fold): Coord | null => {
	if (fold.axis === 'x') {
		const fx = foldValue(x, fold.coord)
		return fx === null ? null : { x: fx, y }
	} else {
		const fy = foldValue(y, fold.coord)
		return fy === null ? null : { x, y: fy }
	}
}

const foldPaper = (paper: Paper, times?: number): Coord[] => {
	let foldedCoords = paper.coords
	let folds = 0

	for (const fold of paper.folds) {
		folds++
		foldedCoords = foldedCoords
			.map((coord) => foldCoord(coord, fold))
			.filter((coord): coord is Coord => coord !== null)

		if (times !== undefined && folds >= times) return foldedCoords
	}

	return foldedCoords
}

const printPaper = (coords: Coord[]): string => {
	// Find max paper size
	const { x, y } = coords.reduce((acc, coord) => ({
		x: Math.max(acc.x, coord.x),
		y: Math.max(acc.y, coord.y),
	}))

	// Create paper
	const paper = Array.from({ length: y + 1 }).map(() => Array(x + 1).fill('.'))
	for (const { x, y } of coords) {
		paper[y][x] = '#'
	}

	return paper.map((line) => line.join('')).join('\n')
}

// Part A

const coordsA = foldPaper(paper, 1)
logAnswer('A', countVisible(coordsA))

// Part B

const coordsB = foldPaper(paper)
logAnswer('B', printPaper(coordsB))
