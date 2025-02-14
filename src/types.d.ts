
export type MatchValue<T> = T;

export type PatternExpression<T> = Pattern<T> | MatchFunction<T>

export type Pattern<T> = {
    [P in keyof T]? : Nullish<T[P]>;
}

export type MatchFunction<T> = ((obj: T) => boolean)
export type AsyncMatchFunction<T> = (obj: T) => Promise<boolean>
export type MatchPromiseArray<T> = (Promise<boolean> | ((x: T) => Promise<boolean>))[]

type Nullish<T> = T | undefined | null;