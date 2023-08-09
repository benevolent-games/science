
export type Codes = {[key: string]: string}
export type ColorFunction = (s: string) => string
export type ToColors<C extends Codes> = {[P in keyof C]: ColorFunction}

