describe('Simple app', function() {
  const format = 'yy.mm.minor.micro.modifier'
  const format2 = 'yy.mm.micro'
  const format3 = 'yy.mm.micro'

  it('creates its initial version.', function() {
    expect(calver.init(format)).toBe('21.1.0.0')
    expect(calver.init(format2)).toBe('21.1.0')
  })

  it('increments dev tag two times', function() {
    expect(calver.inc(format, '21.1.0.0', 'dev')).toBe('21.1.0.0-dev.1')
    expect(calver.inc(format, '21.1.0.0-dev.1', 'dev')).toBe('21.1.0.0-dev.2')
  })

  it('goes alpha', function() {
    expect(calver.inc(format, '21.1.0.0-dev.2', 'alpha')).toBe('21.1.0.0-alpha.1')
  })

  it('goes beta and rc', function() {
    expect(calver.inc(format, '21.1.0.0-alpha.0', 'beta')).toBe('21.1.0.0-beta.1')
    expect(calver.inc(format, '21.1.0.0-beta.0', 'rc')).toBe('21.1.0.0-rc.1')
    expect(calver.inc(format, '21.1.0.0-rc.0', 'rc')).toBe('21.1.0.0-rc.1')
    expect(calver.inc(format, '21.1.0.0-rc.1', 'rc')).toBe('21.1.0.0-rc.2')
    expect(calver.inc(format, '21.1.0.0-rc.2', 'rc')).toBe('21.1.0.0-rc.3')
    expect(calver.inc(format, '21.1.0.0-rc.3', 'rc')).toBe('21.1.0.0-rc.4')
  })

  it('first production release', function() {
    expect(calver.inc(format, '21.1.0.0-rc.4', 'minor')).toBe('21.1.1.0')
  })

  it('releases some bug fixes', function() {
    expect(calver.inc(format, '21.1.1.0', 'micro')).toBe('21.1.1.1')
    expect(calver.inc(format, '21.1.1.1', 'micro')).toBe('21.1.1.2')
    expect(calver.inc(format, '21.1.1.2', 'micro')).toBe('21.1.1.3')
    expect(calver.inc(format, '21.1.1.3', 'micro')).toBe('21.1.1.4')

    expect(calver.inc(format2, '21.1.0', 'micro')).toBe('21.1.1')
    expect(calver.inc(format2, '21.1.1', 'micro')).toBe('21.1.2')
    expect(calver.inc(format2, '21.1.2', 'micro')).toBe('21.1.3')

    expect(calver.inc(format3, '20.9.2', 'micro')).toBe('20.9.3')
    expect(calver.inc(format3, '20.9.3', 'micro')).toBe('20.9.4')
  })

  it('added some new features', function() {
    expect(calver.inc(format, '21.1.1.4', 'minor')).toBe('21.1.2.0')
  })

  it('decided to make a calendar release', function() {
    expect(calver.inc(format, '20.1.2.0', 'calendar.dev')).toBe('21.1.0.0-dev.1')

    expect(calver.inc(format3, '20.9.4', 'calendar.micro')).toBe('21.1.0')
    expect(calver.inc(format3, '21.1.0', 'calendar.micro')).toBe('21.1.1')
    expect(calver.inc(format3, '21.1.1', 'calendar.micro')).toBe('21.1.2')
  })
})
