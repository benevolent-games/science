
import {Failure} from "./failure.js"

export class FailedExpectation extends Failure {
	name = this.constructor.name
}
