
import {nap} from "../tooling/nap.js"
import {Suite} from "../suiteing/suite.js"
import {TestcaseMeta} from "../suiteing/testcase-meta.js"

export function flattenTestcases<S extends Suite>(suite: S) {
	function recurse(s: Suite, cases: TestcaseMeta[], path: string[]) {
		if (typeof s === "function") {
			cases.push({path, testcase: s})
		}
		else if (typeof s === "object" && s !== null) {
			for (const [key, value] of Object.entries(s))
				recurse(value, cases, [...path, key])
		}
		else {
			throw new Error(`invalid property in test suite, at ${path.join(".")}`)
		}
	}
	const cases: TestcaseMeta[] = []
	recurse(suite, cases, [])
	return cases
}

const ignoreIndicators = [
	"XX",
	"//",
	"IGNORE",
]

const focusIndicators = [
	"->",
	"=>",
	"=>>",
	"@",
	"FOCUS",
]

export function isIndicated(name: string, indicators: string[]) {
	return indicators.some(indicator => name.startsWith(indicator))
}

export function isFocusIndicated(name: string) {
	return focusIndicators.some(indicator => name.startsWith(indicator))
}

export function filterForIndicatedCases(
		indicators: string[],
		invert: boolean = false,
	) {
	return function filter({path}: TestcaseMeta) {
		const result = path.some(
			name => isIndicated(name, indicators)
		)
		return invert
			? !result
			: result
	}
}

export type TestOptions = {
	workloadSize?: number
}

export const defaultTestOptions = Object.freeze({
	workloadSize: 10,
} satisfies TestOptions)

export function chunkify<I>(array: I[], workloadSize: number): I[][] {
	const chunks: I[][] = []
	let currentChunk: I[] = []

	function commit() {
		if (currentChunk.length > 0) {
			chunks.push(currentChunk)
			currentChunk = []
		}
	}

	for (const item of array) {
		currentChunk.push(item)
		if (currentChunk.length >= workloadSize)
			commit()
	}

	commit()
	return chunks
}

export type ParsedCases = {
	raw: TestcaseMeta[]
	allowed: TestcaseMeta[]
	focused: TestcaseMeta[]
	testcases: TestcaseMeta[]
}

export function parseTestCases(suite: Suite): ParsedCases {
	const raw = flattenTestcases(suite)

	const allowed = raw.filter(
		filterForIndicatedCases(ignoreIndicators, true)
	)

	const focused = allowed.filter(
		filterForIndicatedCases(focusIndicators)
	)

	const testcases = (focused.length > 0)
		? focused
		: allowed

	return {
		raw,
		allowed,
		focused,
		testcases,
	}
}

export function initializeSuiteReport({
		raw,
		allowed,
		focused,
		testcases,
	}: ParsedCases): SuiteInfo {

	return {
		total: raw.length,
		allowed: allowed.length,
		focused: focused.length,
		scheduled: testcases.length,
		ignored: raw.length - allowed.length,
	}
}

export type TestReport = {
	time: number
	path: string[]
	err?: any
}

export type SuiteInfo = {
	total: number
	allowed: number
	focused: number
	ignored: number
	scheduled: number
}

export type SuiteDetails = {
	time: number
	ran: number
	passed: number
	failed: number
	tests: TestReport[]
}

export type SuiteReport = SuiteInfo & SuiteDetails

export async function executeTestWorkloads(
		workloads: TestcaseMeta[][],
	): Promise<SuiteDetails> {
	
	async function execute(
			{path, testcase}: TestcaseMeta,
		): Promise<TestReport> {

		let err: any = undefined
		const start = performance.now()

		try { await testcase() }
		catch (error) { err = error }

		const time = performance.now() - start
		return {path, time, err}
	}

	let tests: TestReport[] = []
	let time = 0
	let passed = 0
	let failed = 0

	for (const workload of workloads) {
		await nap()

		for (const test of await Promise.all(workload.map(execute))) {
			tests.push(test)
			time += test.time
			if (test.err !== undefined)
				failed += 1
			else
				passed += 1
		}
	}

	return {
		tests,
		time,
		failed,
		passed,
		ran: tests.length,
	}
}

export async function test<S extends Suite>(
		suite: S,
		{
			workloadSize = defaultTestOptions.workloadSize,
		}: TestOptions = defaultTestOptions,
	): Promise<SuiteReport> {

	const parsed = parseTestCases(suite)
	const {testcases} = parsed

	const info = initializeSuiteReport(parsed)
	const workloads = chunkify(testcases, workloadSize)
	const details = await executeTestWorkloads(workloads)

	return {...info, ...details}
}
