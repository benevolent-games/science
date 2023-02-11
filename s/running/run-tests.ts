
import {colors} from "../tooling/colors.js"
import {Failure} from "../erroring/failure.js"

export async function runTests<
		T extends {[key: string]: () => Promise<void>}
	>(tests: T) {

	const testEntries = [...Object.entries(tests)]
	const failures: [string, Error][] = []

	await Promise.all(
		testEntries.map(
			async([label, test]) => test().catch(err => {
				if (err instanceof Error)
					failures.push([label, err])
				else {
					console.error(colors.red("UNKNOWN ERROR!!"))
					console.error(err)
					process.exit(1)
				}
			})
		)
	)

	const nfail = failures.length
	const failed = nfail > 0
	const failure_s = nfail === 1 ?"failure" :"failures"

	if (failed) {
		for (const [testLabel, error] of failures) {

			console.error([
				colors.magenta(error.name),
				colors.yellow(testLabel),
				colors.red("fails"),
				colors.magenta(error.message),
			].join(" "))

			if (!(error instanceof Failure) && error.stack) {
				console.error(
					colors.green(
						error
							.stack
							.split("\n")
							.slice(1)
							.join("\n")
					)
				)
			}
		}

		console.error(colors.red(`${nfail} ${failure_s}.`))
		process.exit(1)
	}
	else {
		console.log(colors.green(`${nfail} ${failure_s}.`))
		process.exit(0)
	}
}
