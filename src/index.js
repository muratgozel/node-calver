const createDateVersion = require('./domain/datever')
const createSemanticVersion = require('./domain/semver')

function Calver() {
  const tags = {
    date: ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D'],
    semantic: ['MAJOR', 'MINOR', 'MICRO', 'MODIFIER'],
    modifier: ['DEV', 'ALPHA', 'BETA', 'RC']
  }
  const levels = ['CALENDAR', 'MAJOR', 'MINOR', 'MICRO', 'DEV', 'ALPHA', 'BETA', 'RC']
  const date = {
    now: new Date(Date.now())
  }

  function valid(format, ver) {
    format = format.toUpperCase()

    validateFormat(format)
    validateVersion(ver, format)
    createDateVersion(format, ver, date.now, tags)
    createSemanticVersion(format, ver, tags)
    
    return true;
  }

  function init(format) {
    format = validateFormat(format, {transformModifiers: false})

    const datever = createDateVersion(format, '', date.now, tags)
    const semver = createSemanticVersion(format, '', tags)

    const tagssemantic = format.split('.').filter(f => tags.semantic.indexOf(f) !== -1)
    if (tagssemantic.length > 0) {
      semver.inc(tagssemantic[0])
    }
    const tagsdate = format.split('.').filter(f => tags.date.indexOf(f) !== -1)
    if (tagsdate.length > 0) {
      datever.inc('CALENDAR')
      semver.inc('CALENDAR')
    }
    const tagsmodifier = format.split('.').filter(f => tags.modifier.indexOf(f) !== -1)
    if (tagsmodifier.length > 0) {
      semver.inc(tagsmodifier[0])
    }

    return [datever.asString(), semver.asString()].filter(s => s).join('.')
  }

  function inc(format, ver, level) {
    format = validateFormat(format)
    ver = validateVersion(ver, format)
    level = validateLevel(level, format)

    const datever = createDateVersion(format, ver, date.now, tags)
    const semver = createSemanticVersion(format, ver, tags)

    const levelsarr = level.split('.')
    for (let i = 0; i < levelsarr.length; i++) {
      const l = levelsarr[i]
      datever.inc(l)
      semver.inc(l)
    }

    return [datever.asString(), semver.asString()].filter(s => s).join('.')
  }

  function pretty(format, ver, locale=undefined) {
    format = validateFormat(format)
    ver = validateVersion(ver, format)

    const datever = createDateVersion(format, ver, date.now, tags)
    const semver = createSemanticVersion(format, ver, tags)

    return datever.pretty(locale) + ' v' + semver.asString() + ''
  }

  function getTagType(input) {
    input = input.toUpperCase()

    if (tags.date.indexOf(input) !== -1) return 'date'
    else if (tags.semantic.indexOf(input) !== -1) return 'semantic'
    else if (tags.modifier.indexOf(input) !== -1) return 'modifier'
    else return ''
  }

  function validateLevel(level, format) {
    if (!level)
      throw new Error('Please specify a valid level.');
    level = level.trim().toUpperCase()
    const formatarr = format.split('.')
    const levelsarr = level.split('.')
    if (levelsarr.length > 2)
      throw new Error('You can specify 2 levels at max.');
    if (!levelsarr)
      throw new Error('You should specify at least one level.');

    for (var i = 0; i < levelsarr.length; i++) {
      const l = levelsarr[i]
      if (levels.indexOf(l) === -1)
        throw new Error('Invalid level.');
      if (tags.modifier.indexOf(l) !== -1 && formatarr.indexOf('MODIFIER') === -1)
        throw new Error('Level and format doesn\'t match.');
      if (tags.semantic.indexOf(l) !== -1 && formatarr.indexOf(l) === -1)
        throw new Error('Level and format doesn\'t match.');
    }

    if (levelsarr.length === 2) {
      if (tags.modifier.indexOf(levelsarr[0]) !== -1)
        throw new Error('Place the modifier tag at the end.');
      if ((tags.semantic.indexOf(levelsarr[0]) !== -1 || levelsarr[0] == 'CALENDAR') &&
          (tags.modifier.indexOf(levelsarr[1]) === -1))
        throw new Error('Second level should be a modifier or remove it.');
    }
    return level
  }

  function validateVersion(ver, format) {
    if (!ver)
      throw new Error('Please specify a valid version.');

    ver = ver.trim().toLowerCase()
    if (/[^a-zA-Z0-9.-]/.test(ver) === true)
      throw new Error('Unexpected characters in your version string.')

    const formatarr = format.split('.')
    const verarr = ver.split(/[.-]/)
    if ((formatarr.indexOf('MODIFIER') === -1 && verarr.length < formatarr.length) ||
        (formatarr.indexOf('MODIFIER') !== -1 && verarr.length + 1 != formatarr.length &&
          verarr.length - 1 != formatarr.length))
      throw new Error('Version and format lengths mismatch.');

    return ver
  }

  function validateFormat(format, opts={transformModifiers: true}) {
    if (!format)
      throw new Error('Please specify a valid format.');
    format = format.trim().toUpperCase().split('.')
      .map(t =>
                tags.modifier.indexOf(t) !== -1 && opts.transformModifiers === true
                  ? 'MODIFIER'
                  : t)
      .join('.')
    const tagsrepo = []
    const tagsarr = format.split('.')
    for (let i = 0; i < tagsarr.length; i++) {
      const t = tagsarr[i].toUpperCase()

      if (tags.date.indexOf(t) === -1 && tags.semantic.indexOf(t) === -1 &&
          tags.modifier.indexOf(t) === -1)
        throw new Error('Your format contains invalid tags.');

      if (tagsrepo.indexOf(t) !== -1)
        throw new Error('Your format is repeating the same tag.')
      tagsrepo.push(t);
    }

    const tagsdate = tagsrepo.filter(t => tags.date.indexOf(t) !== -1)
    let largestDateTagIndex = null
    if (tagsdate.length > 0) {
      const tagsdatesorted = tags.date.filter(t => tagsdate.indexOf(t) !== -1)
      for (let j = 0; j < tagsdatesorted.length; j++) {
        if (tagsdatesorted[j] != tagsdate[j])
          throw new Error('Date tags are in the wrong order.');
        largestDateTagIndex = tagsrepo.indexOf(tagsdate[j])
      }
    }

    const tagssemantic = tagsrepo.filter(t => tags.semantic.indexOf(t) !== -1)
    let largestSemanticTagIndex = null
    if (tagssemantic.length > 0) {
      const tagssemanticsorted = tags.semantic.filter(t => tagssemantic.indexOf(t) !== -1)
      for (let k = 0; k < tagssemanticsorted.length; k++) {
        if (tagssemanticsorted[k] != tagssemantic[k])
          throw new Error('Semantic tags are in the wrong order.');
        if (largestSemanticTagIndex === null)
          largestSemanticTagIndex = tagsrepo.indexOf(tagssemantic[k])
      }
    }

    if (largestDateTagIndex !== null && largestSemanticTagIndex !== null &&
        largestDateTagIndex > largestSemanticTagIndex)
      throw new Error('Semantic tags should come after date tags.');

    return format
  }

  return {
    init: init,
    inc: inc,
    pretty: pretty,
    getTagType: getTagType,
    valid: valid
  }
}

module.exports = Calver()
