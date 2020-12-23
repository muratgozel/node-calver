describe('Basic functionality.', function() {
  const now = new Date()
  const calver = new Calver('YY.MM.MINOR')

  it('throws if format not valid or specified.', function() {
    expect(function() {new Calver();}).toThrow()
    expect(function() {new Calver('AA');}).toThrow()
  })

  it('throws if version and format doesn\'t match.', function() {
    expect(function() {new Calver('YY.MM.MINOR', '20.5.3.0');}).toThrow()
  })

  it('returns week number of given date.', function() {
    expect(calver.getWeekNumber(new Date('2020-01-01'), {zeroPadded: true})).toBe('01')
    expect(calver.getWeekNumber(new Date('2020-01-01'), {zeroPadded: false})).toBe(1)
  })

  it('returns current version.', function() {
    const version = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    expect(calver.get()).toBe(version)
  })

  it('increments an existing version.', function() {
    const calver2 = new Calver('YY.MM.MINOR', '19.1.2')
    expect(calver2.get()).toBe('19.1.2')

    calver2.inc()
    const version = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    expect(calver2.get()).toBe(version)

    calver2.inc('minor')
    const version2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.1'
    expect(calver2.get()).toBe(version2)

    const calver3 = new Calver('YY.MM.MINOR', '20.5.1')
    expect(calver3.get()).toBe('20.5.1')

    calver3.inc('minor')
    expect(calver3.get()).toBe('20.5.2')
    calver3.inc()
    const version3 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    expect(calver3.get()).toBe(version3)
    calver3.inc()
    expect(calver3.get()).toBe(version3)

    const calver4 = new Calver('YY.MM.MINOR', '20.7.0')
    calver4.inc('minor')
    expect(calver4.get()).toBe('20.7.1')
  })

  it('cleans the given input.', function() {
    expect(calver.clean(0)).toBe('')
    expect(calver.clean('20')).toBe('20')
    expect(calver.clean(' 20 ,')).toBe('20')
  })

  it('increments the version.', function() {
    const calver2 = new Calver('YY.MM.MINOR')
    const currentVersion = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    const nextVersion = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.1'
    expect(calver2.get()).toBe(currentVersion)
    calver2.inc()
    expect(calver2.get()).toBe(nextVersion)

    const calver3 = new Calver('YY.MM.MAJOR.MICRO')
    const currentVersion2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0.0'
    const nextVersion2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0.0'
    expect(calver3.get()).toBe(currentVersion2)
    calver2.inc()
    expect(calver3.get()).toBe(nextVersion2)
  })

  it('checks if the given version is greater.', function() {
    const calver3 = new Calver('YY.MM.MINOR')

    expect(calver3.gt('19.7.122')).toBe(true)
    expect(calver3.gt('21.1.1')).toBe(false)

    const v1 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.2'
    expect(calver3.gt(v1)).toBe(false)

    const v2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    expect(calver3.gt(v2)).toBe(false)

    calver3.inc('minor')
    expect(calver3.gt(v2)).toBe(true)
  })

  it('checks if the given version is lower.', function() {
    const calver4 = new Calver('YY.MM.MINOR')

    expect(calver4.lt('19.7.122')).toBe(false)
    expect(calver4.lt('21.1.1')).toBe(true)
  })

  it('validates tag values.', function() {
    const calver5 = new Calver('YY.0M.DD.MINOR.MICRO')

    expect(calver5.matchTagValue('YYYY', 1000)).toBe('1000')
    expect(calver5.matchTagValue('YYYY', 9999)).toBe('9999')
    expect(calver5.matchTagValue('YYYY', 999)).toBe(undefined)
    expect(calver5.matchTagValue('YYYY', 10000)).toBe(undefined)
    expect(calver5.matchTagValue('YYYY', null)).toBe(undefined)

    expect(calver5.matchTagValue('YY', 0)).toBe('0')
    expect(calver5.matchTagValue('YY', 1)).toBe('1')
    expect(calver5.matchTagValue('YY', 10)).toBe('10')
    expect(calver5.matchTagValue('YY', 99)).toBe('99')
    expect(calver5.matchTagValue('YY', 100)).toBe('100')
    expect(calver5.matchTagValue('YY', null)).toBe(undefined)

    expect(calver5.matchTagValue('MM', 1)).toBe('1')
    expect(calver5.matchTagValue('MM', 12)).toBe('12')
    expect(calver5.matchTagValue('MM', 0)).toBe(undefined)
    expect(calver5.matchTagValue('MM', 13)).toBe(undefined)
    expect(calver5.matchTagValue('MM', null)).toBe(undefined)

    expect(calver5.matchTagValue('0M', '01')).toBe('01')
    expect(calver5.matchTagValue('0M', '12')).toBe('12')
    expect(calver5.matchTagValue('0M', '0')).toBe(undefined)
    expect(calver5.matchTagValue('0M', '13')).toBe(undefined)
    expect(calver5.matchTagValue('0M', 'a')).toBe(undefined)
    expect(calver5.matchTagValue('0M', null)).toBe(undefined)

    expect(calver5.matchTagValue('WW', 1)).toBe('1')
    expect(calver5.matchTagValue('WW', 52)).toBe('52')
    expect(calver5.matchTagValue('WW', 0)).toBe(undefined)
    expect(calver5.matchTagValue('WW', 53)).toBe(undefined)
    expect(calver5.matchTagValue('WW', 'a')).toBe(undefined)

    expect(calver5.matchTagValue('0W', '01')).toBe('01')
    expect(calver5.matchTagValue('0W', '52')).toBe('52')
    expect(calver5.matchTagValue('0W', '00')).toBe(undefined)
    expect(calver5.matchTagValue('0W', '53')).toBe(undefined)
    expect(calver5.matchTagValue('0W', 'a')).toBe(undefined)

    expect(calver5.matchTagValue('DD', 1)).toBe('1')
    expect(calver5.matchTagValue('DD', 31)).toBe('31')
    expect(calver5.matchTagValue('DD', 0)).toBe(undefined)
    expect(calver5.matchTagValue('DD', 32)).toBe(undefined)
    expect(calver5.matchTagValue('DD', 'a')).toBe(undefined)

    expect(calver5.matchTagValue('0D', '01')).toBe('01')
    expect(calver5.matchTagValue('0D', '31')).toBe('31')
    expect(calver5.matchTagValue('0D', '00')).toBe(undefined)
    expect(calver5.matchTagValue('0D', '32')).toBe(undefined)
    expect(calver5.matchTagValue('0D', 'a')).toBe(undefined)

    expect(calver5.matchTagValue('MAJOR', '1')).toBe('1')
    expect(calver5.matchTagValue('MAJOR', 1)).toBe('1')
    expect(calver5.matchTagValue('MAJOR', 129)).toBe('129')
    expect(calver5.matchTagValue('MAJOR', 'a')).toBe(undefined)
    expect(calver5.matchTagValue('MAJOR', '1.9')).toBe(undefined)
    expect(calver5.matchTagValue('MAJOR', 1.9)).toBe(undefined)
  })

  it('validates version strings.', function() {
    const calver6 = new Calver('YYYY.MM')

    expect(calver6.valid('2020.5', 'YYYY.MM')).toBe(true)
    expect(calver6.valid('2020.5.333', 'YY.MM.MICRO')).toBe(false)
    expect(calver6.valid('2020.5.333', 'YYYY.MM.MINOR')).toBe(true)
    expect(calver6.valid('20.05.0', 'YY.0M.MICRO')).toBe(true)
    expect(calver6.valid('20.05.0', 'YY.MM.MICRO')).toBe(false)
  })
})
