import { isParameter } from 'typescript'
import { inputAsStringArray, logAnswer } from '../helpers'

// Setup

type Point = {
	x: number
	y: number
}

type Line = {
	points: Point[]
	isCardinal: boolean
}

type VentsPlot = Record<string, number>

const getMinMax = (a: number, b: number): [number, number] => {
	return [Math.min(a, b), Math.max(a, b)]
}

const pointsIntersect = (a: Point, b: Point) => {
	return a.x === b.x && a.y === b.y
}

const asKey = ({ x, y }: Point): string => {
	return [x, y].join(',')
}

const pointFromRaw = (raw: string): Point => {
	const [x, y] = raw.split(',').map(Number)
	return { x, y }
}

const lineFromRaw = (raw: string): Line => {
	const [rawA, rawB] = raw.split(' -> ')
	const a = pointFromRaw(rawA)
	const b = pointFromRaw(rawB)

	const dx = b.x - a.x
	const dy = b.y - a.y
	const isCardinal = dx === 0 || dy === 0

	// Track all points on line
	const points: Point[] = [a, b]
	const exists = (point: Point) => points.some((p) => pointsIntersect(point, p))
	const add = (x: number, y: number) => {
		const point = { x, y }
		if (!exists(point)) points.push(point)
	}

	// Generate all points on line by iterating x and y axes
	if (dx === 0) {
		// Vertical line
		const [yMin, yMax] = getMinMax(a.y, b.y)
		for (let y = yMin; y <= yMax; y++) add(a.x, y)
	} else if (dy === 0) {
		// Horizontal line
		const [xMin, xMax] = getMinMax(a.x, b.x)
		for (let x = xMin; x <= xMax; x++) add(x, a.y)
	} else {
		// Cheeky linear algebra
		const m = dy / dx
		const c = a.y - m * a.x

		const [xMin, xMax] = getMinMax(a.x, b.x)
		for (let x = xMin; x <= xMax; x++) {
			const y = Math.round(m * x + c)
			add(x, y)
		}

		const [yMin, yMax] = getMinMax(a.y, b.y)
		for (let y = yMin; y <= yMax; y++) {
			const x = Math.round((y - c) / m)
			add(x, y)
		}
	}

	return { points, isCardinal }
}

// Setup
const lines = inputAsStringArray(__dirname, 'input.txt').map(lineFromRaw)

const plotVents = (lines: Line[], cardinalOnly = true): VentsPlot => {
	const vents: VentsPlot = {}
	const plot = (point: Point) => {
		const key = asKey(point)
		if (key in vents) vents[key]++
		else vents[key] = 1
	}

	for (const line of lines) {
		if (cardinalOnly && !line.isCardinal) continue
		for (const point of line.points) plot(point)
	}

	return vents
}

const countOverlapsOverThreshold = (
	vents: VentsPlot,
	threshold: number
): number => {
	return Object.values(vents).reduce(
		(acc, overlaps) => acc + Number(overlaps >= threshold),
		0
	)
}

// Part A
const cardinalVents = plotVents(lines)
logAnswer('A', countOverlapsOverThreshold(cardinalVents, 2))

// Part B
const allVents = plotVents(lines, false)
logAnswer('B', countOverlapsOverThreshold(allVents, 2))
