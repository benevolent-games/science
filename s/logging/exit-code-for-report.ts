
import {SuiteReport} from "../running/test.js"

export function exitCodeForReport(report: SuiteReport) {
	return report.failed === 0
		? 0
		: 1
}
