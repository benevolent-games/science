
import {Theme} from "../theme.js"
import {colors, noop, theme} from "../../tooling/colors.js"

export const eccentric = theme<Theme>({
	base: noop,
	time: noop,
	pass: colors.cyan,
	fail: colors.magenta,
	label: colors.blue,
	error: colors.cyan,
	focus: colors.yellow,
	ignore: colors.blue,
})
