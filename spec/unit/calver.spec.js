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

  it('throws if user tries to change format later.', function() {
    expect(function() { return calver.setFormat('YY.MM') }).toThrow()
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

    calver2.inc()
    const version2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.1'
    expect(calver2.get()).toBe(version2)

    const calver3 = new Calver('YY.MM.MINOR', '20.5.1')
    expect(calver3.get()).toBe('20.5.1')

    calver3.inc()
    expect(calver3.get()).toBe('20.5.2')
  })

  it('cleans the given input.', function() {
    expect(calver.clean(0)).toBe('')
    expect(calver.clean('20')).toBe('20')
    expect(calver.clean(' 20 ,')).toBe('20')
  })

  it('increments the version.', function() {
    const calver2 = new Calver('YY.MM.MINOR')
    calver2.inc()
    const nextVersion = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.1'
    expect(calver2.get()).toBe(nextVersion)
  })

  it('parse.', function() {
    expect(calver.parse('2020', 'YYYY')).toEqual({YYYY: 2020})
    expect(calver.parse('2020.5.0', 'YYYY.MM.MICRO')).toEqual({YYYY: 2020, MM: 5, MICRO: 0})
    expect(calver.parse('2020.05.1', 'YYYY.0M.MICRO')).toEqual({YYYY: 2020, '0M': '05', MICRO: 1})
  })

  it('checks if the given version is greater.', function() {
    const calver3 = new Calver('YY.MM.MINOR')

    expect(calver3.gt('19.7.122')).toBe(true)
    expect(calver3.gt('21.1.1')).toBe(false)

    const v1 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.2'
    expect(calver3.gt(v1)).toBe(false)

    const v2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.0'
    expect(calver3.gt(v2)).toBe(false)

    calver3.inc()
    expect(calver3.gt(v2)).toBe(true)
  })

  it('checks if the given version is lower.', function() {
    const calver4 = new Calver('YY.MM.MINOR')

    expect(calver4.lt('19.7.122')).toBe(false)
    expect(calver4.lt('21.1.1')).toBe(true)
  })

  it('validates tag values.', function() {
    const calver5 = new Calver('YY.0M.DD.MINOR.MICRO')

    expect(calver5.validateTagValue('YYYY', 1000)).toBe(true)
    expect(calver5.validateTagValue('YYYY', 9999)).toBe(true)
    expect(calver5.validateTagValue('YYYY', 999)).toBe(false)
    expect(calver5.validateTagValue('YYYY', 10000)).toBe(false)
    expect(calver5.validateTagValue('YYYY', null)).toBe(false)

    expect(calver5.validateTagValue('YY', 0)).toBe(true)
    expect(calver5.validateTagValue('YY', 1)).toBe(true)
    expect(calver5.validateTagValue('YY', 10)).toBe(true)
    expect(calver5.validateTagValue('YY', 99)).toBe(true)
    expect(calver5.validateTagValue('YY', 100)).toBe(false)
    expect(calver5.validateTagValue('YY', null)).toBe(false)

    expect(calver5.validateTagValue('0Y', '0')).toBe(true)
    expect(calver5.validateTagValue('0Y', '1')).toBe(true)
    expect(calver5.validateTagValue('0Y', '10')).toBe(true)
    expect(calver5.validateTagValue('0Y', '99')).toBe(true)
    expect(calver5.validateTagValue('0Y', '100')).toBe(false)
    expect(calver5.validateTagValue('0Y', null)).toBe(false)

    expect(calver5.validateTagValue('MM', 1)).toBe(true)
    expect(calver5.validateTagValue('MM', 12)).toBe(true)
    expect(calver5.validateTagValue('MM', 0)).toBe(false)
    expect(calver5.validateTagValue('MM', 13)).toBe(false)
    expect(calver5.validateTagValue('MM', null)).toBe(false)

    expect(calver5.validateTagValue('0M', '01')).toBe(true)
    expect(calver5.validateTagValue('0M', '12')).toBe(true)
    expect(calver5.validateTagValue('0M', '0')).toBe(false)
    expect(calver5.validateTagValue('0M', '13')).toBe(false)
    expect(calver5.validateTagValue('0M', 'a')).toBe(false)
    expect(calver5.validateTagValue('0M', null)).toBe(false)

    expect(calver5.validateTagValue('WW', 1)).toBe(true)
    expect(calver5.validateTagValue('WW', 52)).toBe(true)
    expect(calver5.validateTagValue('WW', 0)).toBe(false)
    expect(calver5.validateTagValue('WW', 53)).toBe(false)
    expect(calver5.validateTagValue('WW', 'a')).toBe(false)

    expect(calver5.validateTagValue('0W', '01')).toBe(true)
    expect(calver5.validateTagValue('0W', '52')).toBe(true)
    expect(calver5.validateTagValue('0W', '00')).toBe(false)
    expect(calver5.validateTagValue('0W', '53')).toBe(false)
    expect(calver5.validateTagValue('0W', 'a')).toBe(false)

    expect(calver5.validateTagValue('DD', 1)).toBe(true)
    expect(calver5.validateTagValue('DD', 31)).toBe(true)
    expect(calver5.validateTagValue('DD', 0)).toBe(false)
    expect(calver5.validateTagValue('DD', 32)).toBe(false)
    expect(calver5.validateTagValue('DD', 'a')).toBe(false)

    expect(calver5.validateTagValue('0D', '01')).toBe(true)
    expect(calver5.validateTagValue('0D', '31')).toBe(true)
    expect(calver5.validateTagValue('0D', '00')).toBe(false)
    expect(calver5.validateTagValue('0D', '32')).toBe(false)
    expect(calver5.validateTagValue('0D', 'a')).toBe(false)

    expect(calver5.validateTagValue('MAJOR', '1')).toBe(false)
    expect(calver5.validateTagValue('MAJOR', 1)).toBe(true)
    expect(calver5.validateTagValue('MAJOR', 129)).toBe(true)
    expect(calver5.validateTagValue('MAJOR', 'a')).toBe(false)
    expect(calver5.validateTagValue('MAJOR', '1.9')).toBe(false)
    expect(calver5.validateTagValue('MAJOR', 1.9)).toBe(false)
  })

  it('validates version strings.', function() {
    const calver6 = new Calver('YY.0M.DD.MINOR.MICRO')

    expect(calver6.valid('2020.5')).toBe('2020.5')
    expect(calver6.valid('2020.5.333')).toBe('2020.5.333')
    expect(calver6.valid('2020.5.333', 'YYYY.MM')).toBe(false)
    expect(calver6.valid('2020.5.333', 'YYYY.MM.MICRO')).toBe('2020.5.333')
    expect(calver6.valid('2020.05.333', 'YYYY.0M.MICRO')).toBe('2020.05.333')
  })

  it('converts the calver to semver', function() {
    const calver7 = new Calver('YY.MM.DD.MINOR.MICRO')
    const calver8 = new Calver('YY.MM')

    const v1 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString() + '.' + now.getDate() + '+0.0'
    const v2 = now.getFullYear().toString().slice(2) + '.' + (now.getMonth() + 1).toString()
    expect(calver7.toSemver()).toBe(v1)
    expect(calver8.toSemver()).toBe(v2)
  })
})
