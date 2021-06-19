describe('inc', function() {
  it('throws if arguments doesn\'t satisfy each other.', function() {
    expect(() => calver.inc()).toThrow()
    expect(() => calver.inc('yyyy')).toThrow()
    expect(() => calver.inc('yyyy', '2021')).toThrow()
    expect(() => calver.inc('yyyy', '2021', 'minor')).toThrow()
    expect(() => calver.inc('yyyy.minor.mm', '2021.5.5', 'minor')).toThrow()
    expect(() => calver.inc('yyyy.mm.minor', '2021.5', 'minor')).toThrow()
    expect(() => calver.inc('yyyy.mm.minor.modifier', '2021.5-alpha.1', 'minor')).toThrow()
  })

  it('date tags.', function() {
    expect(calver.inc('yyyy', '2020', 'calendar')).toBe('2021')
    expect(calver.inc('yyyy.0m', '2020.02', 'calendar')).toBe('2021.01')
    expect(calver.inc('yyyy.mm', '2020.2', 'calendar')).toBe('2021.1')
    expect(calver.inc('yy.mm.ww.dd', '20.2.7.22', 'calendar')).toBe('21.1.3.19')
    expect(() => calver.inc('yy.mm.dd', '21.1.19', 'calendar')).toThrow()
  })

  it('semantic tags.', function() {
    expect(calver.inc('minor', '4', 'minor')).toBe('5')
    expect(calver.inc('major.minor', '4.3', 'minor')).toBe('4.4')
    expect(calver.inc('major.minor.micro', '1.2.3', 'micro')).toBe('1.2.4')
    expect(calver.inc('major.minor.micro', '1.2.3', 'minor')).toBe('1.3.0')
    expect(calver.inc('major.minor.micro', '1.2.3', 'major')).toBe('2.0.0')
  })

  it('calver.', function() {
    expect(calver.inc('yy.mm.major.minor.micro', '20.4.1.2.3', 'micro')).toBe('20.4.1.2.4')
    expect(calver.inc('yy.mm.major.minor.micro', '20.4.1.2.3', 'minor')).toBe('20.4.1.3.0')
    expect(calver.inc('yy.mm.major.minor.micro', '20.4.1.2.3', 'major')).toBe('20.4.2.0.0')
    expect(calver.inc('yy.mm.major.minor.micro', '20.4.1.2.3', 'calendar')).toBe('21.1.0.0.0')
    expect(calver.inc('yy.0m.dd.minor.micro', '20.04.19.1.2', 'calendar')).toBe('21.01.19.0.0')
    expect(() => calver.inc('yy.0m.dd.minor.micro', '21.01.19.0.0', 'calendar')).toThrow()
  })

  it('modifier tags.', function() {
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.1.2-alpha.0', 'alpha')).toBe('20.4.1.2-alpha.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.1.2-alpha.1', 'minor')).toBe('20.4.2.0')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.2.0', 'alpha')).toBe('20.4.2.0-alpha.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.2.0-alpha.0', 'alpha')).toBe('20.4.2.0-alpha.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.2.0-alpha.1', 'beta')).toBe('20.4.2.0-beta.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.2.0', 'beta')).toBe('20.4.2.0-beta.1')
  })

  it('semantic + modifier tags.', function() {
    expect(calver.inc('yy.mm.minor.micro.modifier', '21.1.1.0', 'minor.beta')).toBe('21.1.2.0-beta.1')
  })

  it('date + modifier tags.', function() {
    expect(calver.inc('yy.mm.minor.micro.modifier', '19.1.1.0', 'calendar.beta')).toBe('21.1.0.0-beta.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.1.2-alpha.1', 'calendar.alpha')).toBe('21.1.0.0-alpha.1')
    expect(calver.inc('yy.mm.minor.micro.modifier', '20.4.1.2-alpha.1', 'micro.alpha')).toBe('20.4.1.3-alpha.1')
    expect(calver.inc('yy.mm.micro', '20.4.1', 'calendar.micro')).toBe('21.1.0')
    expect(calver.inc('yy.mm.micro.modifier', '20.4.1-dev.3', 'calendar.micro')).toBe('21.1.0')
    expect(calver.inc('yy.mm.micro', '21.1.0', 'calendar.micro')).toBe('21.1.1')
  })
})
