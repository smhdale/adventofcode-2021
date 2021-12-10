import { inputAsNumberArray, sumEach, logAnswer } from "../helpers";

// Setup
const nums = inputAsNumberArray(__dirname, 'input.txt')

// Helpers
const countIncreases = (arr: number[]) => arr.reduce((acc, num, index) => {
	return acc + (index > 0 && num > arr[index - 1] ? 1 : 0)
}, 0)

// Part A
logAnswer('A', countIncreases(nums))

// Part B
const windowSize = 3
const numWindows = nums.length - (windowSize - 1)

const windows: number[] = []
for (let i = 0; i < numWindows; i++) {
	windows.push(sumEach(nums.slice(i, i + windowSize)))
}

logAnswer('B', countIncreases(windows))
