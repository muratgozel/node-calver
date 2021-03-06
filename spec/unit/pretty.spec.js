describe('pretty', function() {
  it('shows version in a localized format.', function() {
    expect(calver.pretty('yyyy.mm.micro', '2021.3.24')).toBe('March 2021 (24)')
    expect(calver.pretty('yyyy.mm.micro', '2021.3.24', 'tr')).toBe('Mart 2021 (24)')
  })
})
