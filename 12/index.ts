import { inputAsStringArray, logAnswer } from '../helpers'

const testMap = inputAsStringArray(__dirname, 'test.txt')
const map = inputAsStringArray(__dirname, 'input.txt')

type NodeType = 'start' | 'end' | 'large' | 'small'

type Node = {
	type: NodeType
	connections: Set<string>
}

type NodeMap = Map<string, Node>

type VisitChildPredicate = (name: string, node: Node, path: string[]) => boolean

const resolveNodeType = (name: string): NodeType => {
	return /^[a-z]+$/.test(name) ? 'small' : 'large'
}

const isTerminalNode = (name: string) => ['start', 'end'].includes(name)

const createNodeMap = (map: string[]): NodeMap => {
	const nodes: NodeMap = new Map()

	// Add nodes to map
	for (const line of map) {
		const names = line.split('-')
		for (const name of names) {
			if (!nodes.has(name)) {
				const type = resolveNodeType(name)
				nodes.set(name, { type, connections: new Set() })
			}
		}
	}

	// Add connections
	for (const line of map) {
		const [a, b] = line.split('-')
		const aNode = nodes.get(a)
		const bNode = nodes.get(b)
		if (aNode && bNode) {
			aNode.connections.add(b)
			bNode.connections.add(a)
		}
	}

	return nodes
}

const traverseNodes = (
	map: string[],
	predicate: VisitChildPredicate
): number => {
	const paths: string[][] = []
	const nodes = createNodeMap(map)
	// const seen = getDefaultSeenMap()

	const traverseNode = (name: string, path: string[] = []) => {
		const node = nodes.get(name)
		if (!node) throw new Error(`Missing node: ${name}`)

		// Visit this node
		path.push(name)

		// Record end paths
		if (name === 'end') {
			paths.push(path)
			return
		}

		// Otherwise, traverse all connections
		node.connections.forEach((cnx) => {
			const child = nodes.get(cnx)
			if (!child) return
			else if (!predicate(cnx, child, path)) return
			else traverseNode(cnx, path.slice())
		})
	}

	// Traverse all nodes
	traverseNode('start')
	return paths.length
}

// Part A
const predicateA: VisitChildPredicate = (name, node, path) => {
	// Visit non-small nodes any number of times
	if (node.type !== 'small') return true
	// Visit small nodes only once
	else return !path.includes(name)
}
const pathsA = traverseNodes(map, predicateA)
logAnswer('A', pathsA)

// Part B
const predicateB: VisitChildPredicate = (name, node, path) => {
	// Visit non-small nodes any number of times
	if (node.type !== 'small') return true
	// Visit new small nodes at least once
	else if (!path.includes(name)) return true
	// Disallow visiting terminal nodes more than once
	else if (isTerminalNode(name)) return false
	// Allow visiting a single small node more than once
	else {
		const smallNodes = path.filter((step) => resolveNodeType(step) === 'small')
		return smallNodes.length === new Set(smallNodes).size
	}
}
const pathsB = traverseNodes(map, predicateB)
logAnswer('B', pathsB)
