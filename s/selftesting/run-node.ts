
import suite from "./example.test.js"
import {test} from "../running/test.js"
import {standard} from "../logging/themes/standard.js"
import {logSuiteReport} from "../logging/log-suite-report.js"
import {exitCodeForReport} from "../logging/exit-code-for-report.js"

const report = await test(suite)
const exitCode = exitCodeForReport(report)
const iterator = logSuiteReport({report, theme: standard})

const log = (...args: any[]) => (
	exitCode === 0
		? console.log(...args)
		: console.error(...args)
)

for (const line of iterator)
	log(line)
