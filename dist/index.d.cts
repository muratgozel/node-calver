declare const CALVER_CYCLES: CalVerCycle[]
declare function clean(str: string): string
declare function suffix(str: string, suffix: string): string
declare function prefix(str: string, prefix?: string): string
declare function initial(settings: CalVerCycleSettings): string
declare function nt(
    newer: string,
    older: string,
    settings?: CalVerCycleSettings,
): boolean
declare function ot(
    older: string,
    newer: string,
    settings?: CalVerCycleSettings,
): boolean
declare function cycle(str: string, settings?: CalVerCycleSettings): string
declare function valid(str: string, settings?: CalVerValidSettings): string
declare function parse(
    str: string,
    settings?: CalVerCycleSettings,
): CalVerObject
declare function toString(obj: CalVerObject): string
declare function isCycleValid(
    str: string,
    allowAuto?: boolean,
): str is CalVerCycle
interface CalVerObject {
    year: number
    month?: number
    week?: number
    day?: number
    minor: number
}
type CalVerCycle = 'year' | 'month' | 'week' | 'day' | 'auto'
interface CalVerCycleSettings {
    cycle: CalVerCycle
}
interface CalVerValidSettings {
    cycle: CalVerCycle
}
interface CalVerCurrentDateObject {
    year: number
    month: number
    week: number
    day: number
}

export {
    CALVER_CYCLES,
    type CalVerCurrentDateObject,
    type CalVerCycle,
    type CalVerCycleSettings,
    type CalVerObject,
    type CalVerValidSettings,
    clean,
    cycle,
    initial,
    isCycleValid,
    nt,
    ot,
    parse,
    prefix,
    suffix,
    toString,
    valid,
}
