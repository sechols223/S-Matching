import {AsyncMatchFunction, MatchFunction, MatchPromiseArray, Pattern, PatternExpression} from "./types";

export function createPattern<T>(value: T): MatchExpression<T> {
    return new MatchExpression(value)
}

class MatchExpression<T> {
    readonly value: T;
    
   matched: boolean = true;
   matchPromises: AsyncMatchFunction<T>[] = []
    
    constructor(value: T) {
        this.value = value;
    }
    
    match(expression: PatternExpression<T>): MatchExpression<T> {
        this.matched = typeof (expression) === 'function'
            ? this.handleMatchExpression(expression as MatchFunction<T>)
            : this.handlePatternExpress(expression as Pattern<T>);
        
        return this;
    }

    matchAsync(callbackFn: AsyncMatchFunction<T>): AsyncMatchExpression<T> {
        this.matchPromises = [...this.matchPromises, callbackFn];
        return new AsyncMatchExpression<T>(this.value, this.matchPromises);
    }
    
    check(): boolean {
        return this.matched;
    }
    
    private handleMatchExpression(expression: MatchFunction<T>): boolean {
        return expression(this.value)
    }
    
    private handlePatternExpress(expression: Pattern<T>): boolean {
        const patternKeys = Object.keys(expression) as Array<keyof T>;
        return this.evaluatePatternKeys(patternKeys, expression)
    }
    
    private evaluatePatternKeys(patternKeys: (keyof T)[], expression: Pattern<T>) {
        for (const key of patternKeys) {
            const leftValue = this.value[key];
            const rightValue = expression[key];

            if (leftValue !== rightValue) {
                return false;
            }
        }
        return true;
    }
}

class AsyncMatchExpression<T> {
    private readonly value: T;
    private matched: boolean = true;
    private matchPromises: AsyncMatchFunction<T>[] = []
    
    constructor(value: T, matchPromises: AsyncMatchFunction<T>[]) {
        this.value = value;
        this.matchPromises = matchPromises
    }

    async check(): Promise<boolean> {
        if (this.matchPromises.length > 0) {
            for (const fn of this.matchPromises) {
                const result = await fn(this.value)
                if (!result) return false;
            }
        }
        
        return this.matched;
    }

    match(expression: PatternExpression<T>): AsyncMatchExpression<T> {
        this.matched = typeof (expression) === 'function'
            ? this.handleMatchExpression(expression as MatchFunction<T>)
            : this.handlePatternExpress(expression as Pattern<T>);

        return this;
    }

    matchAsync(callbackFn: (obj: T) =>  Promise<boolean>): AsyncMatchExpression<T> {
        this.matchPromises = [...this.matchPromises, callbackFn];
        return new AsyncMatchExpression<T>(this.value, this.matchPromises);
    }

    private handleMatchExpression(expression: MatchFunction<T>): boolean {
        function isAsyncMatchFunction(fn: any): fn is AsyncMatchFunction<T> {
            return true;
        }

        if (isAsyncMatchFunction(expression)) {
            this.matchPromises = [...this.matchPromises, expression]
            return true;
        }

        return expression(this.value)
    }

    private handlePatternExpress(expression: Pattern<T>): boolean {
        const patternKeys = Object.keys(expression) as Array<keyof T>;
        return this.evaluatePatternKeys(patternKeys, expression)
    }

    private evaluatePatternKeys(patternKeys: (keyof T)[], expression: Pattern<T>) {
        for (const key of patternKeys) {
            const leftValue = this.value[key];
            const rightValue = expression[key];

            if (leftValue !== rightValue) {
                return false;
            }
        }
        return true;
    }
}