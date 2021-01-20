describe('init', function() {
  it('creates initial calver versions', function() {
    expect(calver.init('yy')).toBe('21')
    expect(calver.init('yyyy.mm.micro')).toBe('2021.1.0')
    expect(calver.init('yyyy.mm.minor.micro')).toBe('2021.1.0.0')
    expect(calver.init('minor.micro')).toBe('1.0')
    expect(calver.init('major.minor.micro')).toBe('1.0.0')
    expect(calver.init('major.minor.micro.dev')).toBe('1.0.0-dev.0')
    expect(calver.init('yy.mm.minor.micro.alpha')).toBe('21.1.0.0-alpha.0')
  })
})
