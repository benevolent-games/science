
import suite from "./example.test.js"
import {test} from "../running/test.js"

const result = await test(suite)

console.log(result)
