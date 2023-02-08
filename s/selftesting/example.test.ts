
import {nap} from "../tooling/nap.js"
import {suite} from "../suiteing/suite.js"
import {expect} from "../probing/expect.js"

export default suite({

	async "basic startup routine checks out"() {
		expect("cool is cool")
			.that("cool")
			.is("cool")
	},

	"evil genius doomsday device": await (async() => {
		await nap()
		return {
			"hello world": () => {
				expect("hello world")
					.that("hello" + " world")
					.is("hello world")
			},
			async "lol, lmao"() {
				expect("lol is rofl")
					.that("lol")
					.is("rofl")
			},
		}
	})(),
})
