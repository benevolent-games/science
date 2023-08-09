
import {obtool} from "../../obtool.js"
import {Codes, ColorFunction, ToColors} from "./types.js"

export function prep<C extends Codes>(codes: C) {
	const colorer = (code: string): ColorFunction =>
		s => `${code}${s}${codes.reset}`

	return obtool(codes)
		.map(code => colorer(code)) as ToColors<C>
}

export function noop<C extends Codes>(codes: C) {
	return obtool(codes)
		.map(() => (s: string) => s) as ToColors<C>
}

