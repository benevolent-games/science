
import {Testcase} from "./testcase.js"

export type Suite = Testcase | {
	[key: string]: Suite
}

export function suite<S extends Suite>(s: S): S {
	return s
}
