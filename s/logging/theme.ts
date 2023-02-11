
import {ColorFunction} from "../tooling/colors.js"

export type Theme = {
	base: ColorFunction
	time: ColorFunction
	pass: ColorFunction
	fail: ColorFunction
	error: ColorFunction
	label: ColorFunction
	focus: ColorFunction
	ignore: ColorFunction
}
