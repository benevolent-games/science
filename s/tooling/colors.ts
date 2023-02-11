
import {obtool} from "./obtool.js"

export const codes = Object.freeze({
	black: "\u001b[30m",
	red: "\u001b[31m",
	green: "\u001b[32m",
	yellow: "\u001b[33m",
	blue: "\u001b[34m",
	magenta: "\u001b[35m",
	cyan: "\u001b[36m",
	white: "\u001b[37m",
	reset: "\u001b[0m",
})

export type Codes = typeof codes
export type Colors = typeof colors
export type ColorFunction = (s: string) => string
export type AnyColors = {[key: string]: ColorFunction}

export const noop: ColorFunction = s => s

function prepareColorFunctions(fun: (code: string) => ColorFunction) {
	return obtool(codes).map(code => fun(code))
}

export const colors = prepareColorFunctions(
	code => s =>
		`${code}${s}${codes.reset}`
)

export const nocolors = prepareColorFunctions(
	() => noop
)

export function theme<C extends AnyColors>(c: C): C {
	return c
}

export function uncolor(s: string) {
	return s.replace(
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
		"",
	)
}
