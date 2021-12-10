import { inputAsStringArray, logAnswer } from '../helpers'

type Direction = 'forward' | 'up' | 'down'
type Command = [Direction, number]

const parseCommand = (raw: string): Command => {
	const [dir, amt] = raw.split(' ')
	return [dir as Direction, Number(amt)]
}
const parseCommands = (file: string): Command[] =>
	inputAsStringArray(__dirname, file).map(parseCommand)

class Submarine {
	private x = 0
	private y = 0
	private aim = 0
	private useAim: boolean

	constructor(useAim = false) {
		this.useAim = useAim
	}

	private runCommand([direction, amount]: Command) {
		switch (direction) {
			case 'forward':
				this.x += amount
				if (this.useAim) {
					this.y += this.aim * amount
				}
				break
			case 'up':
				if (this.useAim) {
					this.aim -= amount
				} else {
					this.y -= amount
				}
				break
			case 'down':
				if (this.useAim) {
					this.aim += amount
				} else {
					this.y += amount
				}
				break
		}
	}

	public get position(): number {
		return this.x
	}

	public get depth(): number {
		return this.y
	}

	public pilot(commands: Command[]) {
		for (const command of commands) {
			this.runCommand(command)
		}
	}

	public reportPosition() {
		return {
			position: this.position,
			depth: this.depth,
		}
	}
}

// Setup
const commands = parseCommands('input.txt')

// Part A
const subA = new Submarine()
subA.pilot(commands)
logAnswer('A', subA.position * subA.depth)

// Part B
const subB = new Submarine(true)
subB.pilot(commands)
logAnswer('B', subB.position * subB.depth)
