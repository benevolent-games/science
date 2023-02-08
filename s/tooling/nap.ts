
export async function nap(milliseconds: number = 0) {
	return new Promise(resolve => setTimeout(resolve, milliseconds))
}
