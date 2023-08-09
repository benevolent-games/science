
import {codes} from "./parts/codes.js"
import {noop, prep} from "./parts/preps.js"
import {deep_freeze} from "../deep_freeze.js"

export const color = deep_freeze({
	...prep(codes.color),
	bright: prep(codes.bright),
	bg: {
		...prep(codes.bg),
		bright: prep(codes.bg_bright),
	},
})

export const nocolor = deep_freeze({
	...noop(codes.color),
	bright: noop(codes.bright),
	bg: {
		...noop(codes.bg),
		bright: noop(codes.bg_bright),
	},
})

export function uncolor(s: string) {
	return s.replace(
		/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
		"",
	)
}

