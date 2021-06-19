module.exports = function createSemanticVersion(format, ver, alltags) {
  const tags = format.split('.').filter(f => alltags.semantic.indexOf(f) !== -1)
  const verarr = ver.length > 0 ? ver.split(/[.-]/) : []
  const tagsdate = format.split('.').filter(f => alltags.date.indexOf(f) !== -1)
  tagsdate.map(t => verarr.shift())

  const semversion = {}
  for (let i = 0; i < tags.length; i++) {
    const t = tags[i]
    if (verarr.length === 0) {
      semversion[t] = alltags.modifier.indexOf(t) !== -1 ? 'modifier.0' : '0'
    }
    else {
      semversion[t] =
        t == 'MODIFIER' && verarr.length == i + 2 ? verarr[i] + '.' + verarr[i+1] :
        t == 'MODIFIER' && verarr.length != i + 2 ? 'modifier.0' :
        verarr[i];
    }
  }

  function inc(level, dateUpdated=false) {
    if (['DEV', 'ALPHA', 'BETA', 'RC'].indexOf(level) !== -1) {
      const isLevelChanged = semversion.MODIFIER.split('.')[0].toUpperCase() != level
      const mv = semversion.MODIFIER.split('.')[1]
      semversion.MODIFIER = level.toLowerCase() + '.' +
        (
          semversion.MODIFIER == 'modifier.0'
            ? '1'
            : (isLevelChanged ? '1' : (parseInt(mv) + 1))
        )
    }

    if (['MAJOR', 'MINOR', 'MICRO'].indexOf(level) !== -1) {
      semversion[level] = parseInt(semversion[level]) + 1
      semversion.MODIFIER = ''
      if ((level == 'MINOR' || dateUpdated) && semversion.hasOwnProperty('MICRO'))
        semversion.MICRO = '0';
      if ((level == 'MAJOR' || dateUpdated) && semversion.hasOwnProperty('MICRO'))
        semversion.MICRO = '0';
      if ((level == 'MAJOR' || dateUpdated) && semversion.hasOwnProperty('MINOR'))
        semversion.MINOR = '0';
    }

    if ('CALENDAR' == level) {
      semversion.MODIFIER = ''
      if (semversion.hasOwnProperty('MICRO')) semversion.MICRO = '0'
      if (semversion.hasOwnProperty('MINOR')) semversion.MINOR = '0'
      if (semversion.hasOwnProperty('MAJOR')) semversion.MAJOR = '0'
    }
  }

  function asString() {
    return Object.keys(semversion)
      .filter(t => semversion[t] && t != 'MODIFIER')
      .map(t => semversion[t]).join('.')
      + (semversion.MODIFIER && semversion.MODIFIER != 'modifier.0' ? '-' + semversion.MODIFIER : '')
  }

  return {
    inc: inc,
    asString: asString
  }
}
