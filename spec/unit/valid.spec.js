describe('validate', function() {
  it('format and version strings.', function() {
    expect(() => calver.valid('yyyy', '20')).toThrow()
    expect(() => calver.valid('yy.mm', '20')).toThrow()
    expect(() => calver.valid('yyyy.mm.minor.modifier', '2021.5-alpha.1', 'minor')).toThrow()
  })
})
