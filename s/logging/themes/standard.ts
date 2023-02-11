
import {Theme} from "../theme.js"
import {colors, noop, theme} from "../../tooling/colors.js"

export const standard = theme<Theme>({
	base: noop,
	time: noop,
	pass: colors.green,
	fail: colors.red,
	error: colors.yellow,
	label: colors.magenta,
	focus: colors.yellow,
	ignore: colors.blue,
})
