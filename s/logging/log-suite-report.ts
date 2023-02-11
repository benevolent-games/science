
import {Theme} from "./theme.js"
import {plural} from "../tooling/plural.js"
import {SuiteReport} from "../running/test.js"

function indent(n: number) {
	return " ".repeat(n)
}

export function *logSuiteReport({
		theme,
		report,
	}: {
		theme: Theme
		report: SuiteReport
	}) {

	const failureHasOccurred = report.failed > 0
	const howManyFailures = `${report.failed} failed`

	const focusHasOccurred = report.focused > 0
	const ignoreHasOccurred = report.ignored > 0
	const failedTestReports = report.tests.filter(t => t.err !== undefined)

	for (const test of failedTestReports) {
		let index = 0

		for (const part of test.path) {
			yield indent(index) + theme.label(part)
			index += 1
		}

		const error = test.err instanceof Error
			? test.err
			: new Error("unknown error")

		yield (
			indent(index)
			+ theme.fail(error.name)
			+ " "
			+ theme.error(error.message)
		)

		yield ""
	}

	function logNumber(
			n: number,
			func: (n: number, s: string) => string,
		) {
		const s = plural(n, "", "s")
		return func(n, s)
	}

	const n = plural(report.total, "", "s")
	yield theme.base(`${report.total} test${n}`)

	yield theme.time(
		`${report.time.toFixed(0)} milliseconds`
	)

	if (focusHasOccurred)
		yield logNumber(
			report.focused,
			(n, s) =>
				theme.focus(`${n} focused`)
		)
	else if (ignoreHasOccurred)
		yield logNumber(
			report.ignored,
			(n, s) =>
				theme.ignore(`${n} ignored`)
		)

	yield theme.base(`${report.passed} passed`)

	if (failureHasOccurred)
		yield theme.fail(howManyFailures)
	else
		yield theme.pass(howManyFailures)
}
