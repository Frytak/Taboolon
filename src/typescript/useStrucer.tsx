import { Dispatch, SetStateAction } from "react";

/**
 * Abstraction of Reacts useState return value
 */
export type UseState<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * Abstraction for cosier Reacts useState return value
 */
export type UseStrucer<T> = {
    value: T,
    set: Dispatch<SetStateAction<T>>
};

export type AnyUseState<T> = UseState<T> | UseStrucer<T>;

/**
 * Converts Reacts `useState` to `UseStrucer`.
 * @param useState 
 * @returns 
 */
export function asUseStrucer<T>(useState: UseState<T>): UseStrucer<T> {
    return { value: useState[0], set: useState[1] } as UseStrucer<T>;
}

export function isUseState<T>(anyUseState: AnyUseState<T>): anyUseState is UseState<T> {
    return (anyUseState as UseStrucer<T>).value !== undefined;
}

export function isUseStrucer<T>(anyUseState: AnyUseState<T>): anyUseState is UseStrucer<T> {
    return (anyUseState as UseStrucer<T>).value !== undefined;
}

export function getValue<T>(anyUseState: AnyUseState<T>): T {
    if (isUseState(anyUseState)) { return anyUseState[0]; }
    if (isUseStrucer(anyUseState)) { return anyUseState.value; }
    throw Error("Unhandled case of AnyUseState.");
}

/**
 * If the value of `useState` if undefined, this function will set it to the provided `defaultValue` and return `useState`.
 * 
 * @param useState 
 * @param defaultValue 
 * @returns `useState`
 */
export function setUseStrucerDefault<T>(useState: UseStrucer<T>, defaultValue: T): UseStrucer<NonNullable<T>> {
    if (useState.value === undefined) { useState.set(defaultValue); console.log(defaultValue); }
    console.log(useState)
    return useState as UseStrucer<NonNullable<T>>;
}