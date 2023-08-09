
export namespace Types {
	export type Testcase = () => void | Promise<void>

	export type TestcaseMeta = {
		path: string[]
		testcase: Testcase
	}

	export type Suite = Testcase | {
		[key: string]: Suite
	}
}

export function suite<S extends Types.Suite>(s: S): S {
	return s
}

export function run_node() {}

