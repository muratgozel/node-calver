describe('getTagType', function() {
  it('Returns the type of the tag. It is one of date, semantic or modifier', function() {
    expect(calver.getTagType('mm')).toBe('date')
    expect(calver.getTagType('MM')).toBe('date')
    expect(calver.getTagType('micro')).toBe('semantic')
    expect(calver.getTagType('dev')).toBe('modifier')
    expect(calver.getTagType('asd')).toBe('')
  })
})
