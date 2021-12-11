import { inputAsGroupedStringArray, logAnswer } from '../helpers'

const parseDraws = (raw: string[]) => raw[0].split(',').map(Number)

interface IBingoBoard {
	bingo: boolean
	score: number
	draw(number: number): void
	check(): boolean
}

class BingoBoard implements IBingoBoard {
	private won = false
	private squares: number[] = []
	private drawn: boolean[] = []
	private lastDrawn = 0

	// Checks are defined as [starting index, step amount]
	private static Checks = [
		[0, 1],
		[5, 1],
		[10, 1],
		[15, 1],
		[20, 1],
		[0, 5],
		[1, 5],
		[2, 5],
		[3, 5],
		[4, 5],
	]

	constructor(rawBoard: string[]) {
		for (const line of rawBoard) {
			for (const number of line.trim().split(/\s+/g)) {
				this.squares.push(Number(number))
				this.drawn.push(false)
			}
		}
	}

	public get bingo(): boolean {
		return this.won
	}

	public get score(): number {
		return (
			this.lastDrawn *
			this.squares.reduce((acc, number, index) => {
				return acc + (this.drawn[index] ? 0 : number)
			}, 0)
		)
	}

	public draw(number: number) {
		if (this.won) return
		this.lastDrawn = number
		this.drawn = this.drawn.map((drawn, index) => {
			return this.squares[index] === number ? true : drawn
		})
	}

	public check(): boolean {
		for (const [start, step] of BingoBoard.Checks) {
			let win = true
			const end = start + step * 5
			for (let i = start; i < end; i += step) {
				if (!this.drawn[i]) {
					win = false
					break
				}
			}
			if (win) {
				this.won = true
				return true
			}
		}
		return false
	}
}

// Setup
const [rawDraws, ...rawBoards] = inputAsGroupedStringArray(
	__dirname,
	'input.txt'
)
const draws = parseDraws(rawDraws)
const boards = rawBoards.map((raw) => new BingoBoard(raw))

// Play until all numbers are drawn and return winning order of boards
const winners: BingoBoard[] = []
for (const draw of draws) {
	for (const board of boards) {
		if (board.bingo) continue
		board.draw(draw)
		if (board.check()) winners.push(board)
	}
}

// Part A
logAnswer('A', winners[0].score)

// Part B
logAnswer('B', winners[winners.length - 1].score)
