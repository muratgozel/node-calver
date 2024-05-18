import { expect, test, vi } from 'vitest'
import {
    type CalVerObject,
    cycle,
    initial,
    parse,
    toString,
    valid,
    nt,
    ot,
} from './index.js'

const samples: [string, CalVerObject][] = [
    ['2024', { year: 2024, minor: 0 }],
    ['2024-4', { year: 2024, month: 4, minor: 0 }],
    ['2024-4.123', { year: 2024, month: 4, minor: 123 }],
    ['2024-4-30', { year: 2024, month: 4, day: 30, minor: 0 }],
    ['2024-4-30.123', { year: 2024, month: 4, day: 30, minor: 123 }],
]

test('parse', () => {
    expect(() => parse('')).toThrowError()
    expect(() => parse('1.2.3')).toThrowError()
    expect(() => parse('2024-13')).toThrowError()
    expect(() => parse('2024-13.123')).toThrowError()
    expect(() => parse('2024-56', { cycle: 'week' })).toThrowError()
    expect(() => parse('2024-12-32')).toThrowError()
    expect(parse(samples[0]![0])).toStrictEqual(samples[0]![1])
    expect(parse(samples[1]![0])).toStrictEqual(samples[1]![1])
    expect(parse(samples[2]![0])).toStrictEqual(samples[2]![1])
    expect(parse(samples[1]![0], { cycle: 'week' })).toStrictEqual({
        year: 2024,
        week: 4,
        minor: 0,
    })
    expect(parse(samples[2]![0], { cycle: 'week' })).toStrictEqual({
        year: 2024,
        week: 4,
        minor: 123,
    })
    expect(parse(samples[3]![0])).toStrictEqual(samples[3]![1])
    expect(parse(samples[4]![0])).toStrictEqual(samples[4]![1])
})

test('to string', () => {
    expect(toString(samples[0]![1])).toBe(samples[0]![0])
    expect(toString(samples[1]![1])).toBe(samples[1]![0])
    expect(toString(samples[2]![1])).toBe(samples[2]![0])
    expect(toString({ year: 2024, week: 4, minor: 0 })).toBe(samples[1]![0])
    expect(toString({ year: 2024, week: 4, minor: 123 })).toBe(samples[2]![0])
    expect(toString(samples[3]![1])).toBe(samples[3]![0])
    expect(toString(samples[4]![1])).toBe(samples[4]![0])
})

test('valid', () => {
    expect(() => valid('')).toThrowError()
    expect(() => valid('202')).toThrowError()
    expect(() => valid('202409')).toThrowError()
    expect(valid(samples[0]![0])).toBe(samples[0]![0])
    expect(valid(samples[1]![0])).toBe(samples[1]![0])
    expect(valid(samples[2]![0])).toBe(samples[2]![0])
    expect(valid(samples[3]![0])).toBe(samples[3]![0])

    expect(valid(samples[0]![0], { cycle: 'year' })).toBe(samples[0]![0])
    expect(() => valid(samples[0]![0], { cycle: 'month' })).toThrowError()

    expect(valid(samples[1]![0], { cycle: 'month' })).toBe(samples[1]![0])
    expect(valid(samples[1]![0], { cycle: 'week' })).toBe(samples[1]![0])
    expect(() => valid(samples[1]![0], { cycle: 'year' })).toThrowError()
    expect(() => valid(samples[1]![0], { cycle: 'day' })).toThrowError()

    expect(valid(samples[2]![0], { cycle: 'month' })).toBe(samples[2]![0])
    expect(valid(samples[2]![0], { cycle: 'week' })).toBe(samples[2]![0])
    expect(() => valid(samples[2]![0], { cycle: 'year' })).toThrowError()
    expect(() => valid(samples[2]![0], { cycle: 'day' })).toThrowError()

    expect(valid(samples[3]![0], { cycle: 'day' })).toBe(samples[3]![0])
    expect(valid(samples[3]![0], { cycle: 'auto' })).toBe(samples[3]![0])
    expect(() => valid(samples[3]![0], { cycle: 'month' })).toThrowError()
    expect(() => valid(samples[3]![0], { cycle: 'year' })).toThrowError()
    expect(() => valid(samples[3]![0], { cycle: 'week' })).toThrowError()
})

test('cycle', () => {
    const currentDate = new Date(Date.UTC(2000, 1, 10, 12, 0, 0))
    vi.setSystemTime(currentDate)

    expect(() => cycle('')).toThrowError()
    expect(() => cycle('222')).toThrowError()

    expect(cycle('2000')).toBe('2000.1')
    expect(cycle('2000.123')).toBe('2000.124')
    expect(cycle('1999')).toBe('2000')
    expect(cycle('1999.123')).toBe('2000')
    expect(cycle('2025')).toBe('2025.1')
    expect(cycle('2025.123')).toBe('2025.124')

    expect(cycle('1999-1')).toBe('2000-2')
    expect(cycle('1999-2')).toBe('2000-2')
    expect(cycle('1999-2.123')).toBe('2000-2')
    expect(cycle('1999-3')).toBe('2000-2')
    expect(cycle('2000-1')).toBe('2000-2')
    expect(cycle('2000-1.123')).toBe('2000-2')
    expect(cycle('2000-2')).toBe('2000-2.1')
    expect(cycle('2000-2.123')).toBe('2000-2.124')
    expect(cycle('2025-2')).toBe('2025-2.1')
    expect(cycle('2025-2.123')).toBe('2025-2.124')

    expect(cycle('1999-1', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('1999-2', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('1999-2.123', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('1999-3', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('2000-1', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('2000-1.123', { cycle: 'week' })).toBe('2000-6')
    expect(cycle('2000-6', { cycle: 'week' })).toBe('2000-6.1')
    expect(cycle('2000-6.123', { cycle: 'week' })).toBe('2000-6.124')
    expect(cycle('2025-6', { cycle: 'week' })).toBe('2025-6.1')
    expect(cycle('2025-6.123', { cycle: 'week' })).toBe('2025-6.124')

    expect(cycle('1999-1-29')).toBe('2000-2-10')
    expect(cycle('1999-1-10')).toBe('2000-2-10')
    expect(cycle('2000-1-10')).toBe('2000-2-10')
    expect(cycle('2000-2-9')).toBe('2000-2-10')
    expect(cycle('2000-2-10')).toBe('2000-2-10.1')
    expect(cycle('2000-2-10.123')).toBe('2000-2-10.124')
    expect(cycle('2025-2-10')).toBe('2025-2-10.1')
    expect(cycle('2025-2-10.123')).toBe('2025-2-10.124')
})

test('initial', () => {
    const currentDate = new Date(Date.UTC(2000, 1, 10, 12, 0, 0))
    vi.setSystemTime(currentDate)

    // @ts-ignore
    expect(() => initial({ cycle: 'invalid' })).toThrowError()
    expect(() => initial({ cycle: 'auto' })).toThrowError()
    expect(initial({ cycle: 'year' })).toBe('2000')
    expect(initial({ cycle: 'month' })).toBe('2000-2')
    expect(initial({ cycle: 'day' })).toBe('2000-2-10')
})

test('newer than', () => {
    expect(() => nt('200000', '299999')).toThrowError()
    expect(nt('2020', '2020')).toBe(false)
    expect(nt('2020', '2019')).toBe(true)
    expect(nt('2020', '2021')).toBe(false)
    expect(nt('2020.123', '2020')).toBe(false)
    expect(nt('2020.123', '2019')).toBe(true)
    expect(nt('2020.123', '2021')).toBe(false)
    expect(nt('2020.123', '2020.124')).toBe(false)
    expect(nt('2020.123', '2019.124')).toBe(true)
    expect(nt('2020.123', '2021.124')).toBe(false)

    expect(nt('2020-4', '2020-4')).toBe(false)
    expect(() => nt('2020-13', '2020-12')).toThrowError()
    expect(nt('2020-4', '2020-3')).toBe(true)
    expect(nt('2020-4', '2021-3')).toBe(false)
    expect(nt('2019-4', '2021-3')).toBe(false)
    expect(nt('2020-3', '2020-4')).toBe(false)
    expect(nt('2020-4.123', '2020-4.124')).toBe(false)
    expect(nt('2020-4.123', '2020-3.125')).toBe(true)
    expect(nt('2020-3.123', '2020-4.126')).toBe(false)

    expect(nt('2020-4-20', '2020-4-20')).toBe(false)
    expect(nt('2020-4-20', '2020-4-19')).toBe(true)
    expect(nt('2020-4-20', '2020-4-21')).toBe(false)
    expect(nt('2020-3-20', '2020-4-20')).toBe(false)
    expect(nt('2019-4-20', '2020-4-20')).toBe(false)
    expect(nt('2020-4-20.123', '2020-4-20.129')).toBe(false)
    expect(nt('2020-4-20.123', '2020-4-19.129')).toBe(true)
    expect(nt('2020-4-20.123', '2020-4-21.129')).toBe(false)
})

test('older than', () => {
    expect(ot('2020', '2020')).toBe(false)
    expect(ot('2020', '2019')).toBe(false)
    expect(ot('2020', '2021')).toBe(true)
})
