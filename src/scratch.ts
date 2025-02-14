import {AsyncMatchFunction, PatternExpression} from "./types";
import {createPattern} from "./index";

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
            return false;
        })
        .check();
}

const getValue = async () => 10000;

async function getMatchUsingAsyncExpression() {
    return await createPattern(testObj)
        .matchAsync(async (value: TestType) => {
            const v = await getValue();
            console.log('abc')
            return value.d > v;
        })
        .check();
}

getMatchUsingAsyncExpression().then(value => console.log(value))    

