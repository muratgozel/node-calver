import assert from 'assert'
import calver from '../src/index.js'

// fixed current time stamp in test environment.
// 1611069856248: 19 Jan 2021
Date.now = function now() {
  return 1611069856248;
}

assert.strictEqual(calver.isValid('yyyy.mm.0w', '2020.6.1'), false)
assert.strictEqual(calver.isValid('yyyy.mm.0w', '2020.6.01'), true)
assert.strictEqual(calver.isValid('yyyy.mm.minor.patch', '2022.8.0.0'), true)
assert.strictEqual(calver.isValid('yyyy.mm.minor.patch', '0.0.0.1'), false)

assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1', 'dev'), '2020.6.1-dev.0')
assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1-dev.0', 'dev'), '2020.6.1-dev.1')
assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1-dev.1', 'alpha'), '2020.6.1-alpha.0')
assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1-alpha.0', 'alpha'), '2020.6.1-alpha.1')
assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1-alpha.1', 'alpha'), '2020.6.1-alpha.2')
assert.strictEqual(calver.inc('yyyy.mm.ww', '2020.6.1-alpha.2', 'calendar'), '2020.6.1')
assert.strictEqual(calver.inc('yyyy.mm.0w', '2020.6.01', 'calendar'), '2021.1.03')

assert.strictEqual(calver.inc('yyyy.mm.major.minor', '2020.6.30.40', 'calendar'), '2021.1.30.40')
assert.strictEqual(calver.inc('yyyy.0m.major.minor', '2020.06.30.40', 'calendar'), '2021.01.30.40')
assert.strictEqual(calver.inc('yyyy.mm.major.minor', '2020.6.30.40', 'calendar.dev'), '2021.1.30.40-dev.0')
assert.strictEqual(calver.inc('yyyy.0m.major.minor', '2020.06.30.40-dev.0', 'calendar.dev'), '2021.01.30.40-dev.1')
assert.strictEqual(calver.inc('yyyy.0m.major.minor', '2020.06.30.40-dev.22', 'calendar.dev'), '2021.01.30.40-dev.23')
assert.strictEqual(calver.inc('yyyy.0m.major.minor', '2020.06.30.40-dev.23', 'calendar'), '2020.06.30.40')

assert.strictEqual(calver.inc('yyyy.mm.minor', '2020.6.38', 'minor'), '2020.6.39')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '2020.6.10.38.123', 'minor'), '2020.6.10.39.0')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '2020.6.10.38.123', 'minor.dev'), '2020.6.10.39.0-dev.0')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '2020.6.10.39.0-dev.0', 'dev'), '2020.6.10.39.0-dev.1')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '2020.6.10.39.0-dev.1', 'minor'), '2020.6.10.39.0')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '2020.6.10.38.123', 'major.dev'), '2020.6.11.0.0-dev.0')

assert.strictEqual(calver.inc('major.minor.patch', '1.2.3', 'major'), '2.0.0')
assert.strictEqual(calver.inc('major.minor.patch', '1.2.3', 'minor'), '1.3.0')
assert.strictEqual(calver.inc('major.minor.patch', '1.2.3', 'patch'), '1.2.4')

assert.strictEqual(calver.getTagType('yy'), 'calendar')
assert.strictEqual(calver.getTagType('yyyy'), 'calendar')
assert.strictEqual(calver.getTagType('0w'), 'calendar')
assert.strictEqual(calver.getTagType('major'), 'semantic')
assert.strictEqual(calver.getTagType('patch'), 'semantic')
assert.strictEqual(calver.getTagType('dev'), 'modifier')
assert.strictEqual(calver.getTagType('alpha'), 'modifier')

assert.strictEqual(calver.inc('major.minor.patch', '', 'major'), '1.0.0')
assert.strictEqual(calver.inc('yyyy.mm', '', 'calendar'), '2021.1')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '', 'calendar'), '2021.1.0.0.0')
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '', 'minor'), '0.0.0.1.0')
assert.throws(() => calver.inc('yyyy.mm.major.minor.patch', '0.0.0.1.0', 'calendar'))
assert.strictEqual(calver.inc('yyyy.mm.major.minor.patch', '', 'calendar.dev'), '2021.1.0.0.0-dev.0')

assert.strictEqual(calver.inc('yyyy.mm.minor', '2020.6.38', 'calendar'), '2021.1.38')
assert.throws(() => calver.inc('yyyy.mm.minor', '2021.1.38', 'calendar'))
assert.strictEqual(calver.inc('minor.yyyy.mm', '38.2020.6', 'calendar'), '38.2021.1')
assert.throws(() => calver.inc('minor.yyyy.mm', '38.2021.1', 'calendar'))

assert.strictEqual(calver.inc('YY.MM.MINOR', '20.4.83', 'calendar.minor'), '21.1.0')
assert.strictEqual(calver.inc('YY.MM.MINOR', '21.1.0', 'calendar.minor'), '21.1.1')
assert.strictEqual(calver.inc('YY.MM.MINOR', '21.1.1', 'calendar.minor'), '21.1.2')

assert.strictEqual(calver.inc('yyyy.mm.minor.patch', '', 'calendar'), '2021.1.0.0')
