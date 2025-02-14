import {createPattern} from "../src";
import {PatternExpression} from "../src/types";

type TestType = {
    a: string;
    b: string;
    c: number;
    d: number;
}

const testObj: TestType = {
    a: 'abc',
    b: 'def',
    c: 123,
    d: 456
}

const pattern: PatternExpression<TestType> = {
    a: 'abc',
    b: 'def',
    c: 123,
    d: 777
}

function getMatchUsingPattern() {
    return createPattern(testObj)
        .match(pattern)
        .check();
}

function getMatchUsingExpression() {
    return createPattern(testObj)
        .match((value: TestType) => {
            return value.d > 10000;
        })
        .check();
}

const getValue = async () => new Promise<number>(() => 10000);

function getMatchUsingAsyncExpression() {
    return createPattern(testObj)
        .matchAsync(async (value: TestType) => {
            const v = await getValue();
            return value.d > v;
        })
        .check();
}

describe('Match Tests', () => {
    test('Match (pattern) should be false', () => {
        expect(getMatchUsingPattern()).toBe(false)
    })
    
    test('Match (expression) should be false', () => {
        expect(getMatchUsingExpression()).toBe(false)
    })

    test('Match (expression async) should be false',  () => {
        return expect(getMatchUsingAsyncExpression()).resolves.toBe(false)
    })
})