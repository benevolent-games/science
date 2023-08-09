
export function deep_freeze<O extends {}>(o: O): O {
	if (typeof o !== 'object' || o === null)
		return o

	Object.values(o).forEach(value => {
		if (typeof value === "object" && value !== null)
			deep_freeze(value)
	})

	return Object.freeze(o)
}

