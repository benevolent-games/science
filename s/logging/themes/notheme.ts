
import {Theme} from "../theme.js"
import {standard} from "./standard.js"
import {obtool} from "../../tooling/obtool.js"
import {noop, theme} from "../../tooling/colors.js"

export const notheme = theme<Theme>(
	obtool(standard).map(() => noop)
)
