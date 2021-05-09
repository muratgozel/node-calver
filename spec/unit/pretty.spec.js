describe('pretty', function() {
  it('shows version in a localized format.', function() {
    //'March 2021 #24'
    expect(calver.pretty('yyyy.mm.micro', '2021.3.24')).toBe('March 2021 v24')
    expect(calver.pretty('yyyy.mm.micro', '2021.3.24', 'tr')).toBe('Mart 2021 v24')
    expect(calver.pretty('yy.mm.micro', '21.3.24')).toBe('March 2021 v24')
    expect(calver.pretty('yy.mm.micro', '21.3.24', 'tr')).toBe('Mart 2021 v24')
    expect(calver.pretty('yy.mm.micro', '21.3.1', 'tr')).toBe('Mart 2021 v1')
    expect(calver.pretty('yy.mm.micro', '21.3.1', 'en')).toBe('March 2021 v1')
    expect(calver.pretty('yy.mm.minor.micro', '21.3.4.2', 'en')).toBe('March 2021 v4.2')
    expect(calver.pretty('yy.mm.major.minor.micro', '21.3.6.4.2', 'en')).toBe('March 2021 v6.4.2')
    expect(calver.pretty('yy.mm.micro.dev', '21.3.4-dev.2', 'en')).toBe('March 2021 v4-dev.2')
    expect(calver.pretty('yy.mm.micro.modifier', '21.3.4-alpha.1', 'en')).toBe('March 2021 v4-alpha.1')
    expect(calver.pretty('yy.mm.micro.modifier', '21.3.4', 'en')).toBe('March 2021 v4')
  })
})
