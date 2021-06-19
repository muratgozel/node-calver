module.exports = function createDateVersion(format, ver, now, alltags) {
  let updated = null
  const tags = format.split('.').filter(f => alltags.date.indexOf(f) !== -1)
  const verarr = ver.length > 0 ? ver.split(/[.-]/) : []

  const months = Array(12).fill(1).map((item, i) => (i + 1).toString())
  const monthsz = Array(12).fill(1).map((item, i) => (i > 8 ? '' : '0') + (i + 1))
  const weeks = Array(52).fill(1).map((item, i) => (i + 1).toString())
  const weeksz = Array(52).fill(1).map((item, i) => (i > 8 ? '' : '0') + (i + 1))
  const days = Array(31).fill(1).map((item, i) => (i + 1).toString())
  const daysz = Array(31).fill(1).map((item, i) => (i > 8 ? '' : '0') + (i + 1))

  let dateversion = {}
  if (verarr.length > 0) {
    for (let i = 0; i < tags.length; i++) {
      const t = tags[i]
      const v = verarr[i]
      validate(t, v)
      dateversion[t] = v
    }
  }

  function validate(t, v) {
    if (t == 'YYYY' && /^[0-9]{4}$/.test(v) !== true) throw new Error('Invalid year.')
    if (t == 'YY' && /^[0-9]{1,3}$/.test(v) !== true) throw new Error('Invalid year.')
    if (t == '0Y' && /^[0-9]{2,3}$/.test(v) !== true) throw new Error('Invalid year.')
    if (t == 'MM' && months.indexOf(v) === -1)        throw new Error('Invalid month.')
    if (t == '0M' && monthsz.indexOf(v) === -1)       throw new Error('Invalid month.')
    if (t == 'WW' && weeks.indexOf(v) === -1)         throw new Error('Invalid week.')
    if (t == '0W' && weeksz.indexOf(v) === -1)        throw new Error('Invalid week.')
    if (t == 'DD' && days.indexOf(v) === -1)          throw new Error('Invalid day.')
    if (t == '0D' && daysz.indexOf(v) === -1)         throw new Error('Invalid day.')
    return true;
  }

  function getLiveValue(t) {
    if (t == 'YYYY')
      return now.getUTCFullYear()
    if (t == 'YY')
      return parseInt(now.getUTCFullYear().toString().slice(1))
    if (t == '0Y') {
      const yy = now.getUTCFullYear().toString().slice(1)
      return (yy.length == 1 ? '0' : '') + yy
    }
    if (t == 'MM')
      return now.getUTCMonth() + 1
    if (t == '0M') {
      const mm = now.getUTCMonth() + 1
      return (mm < 10 ? '0' : '') + mm
    }
    if (t == 'WW')
      return getWeekNumber(now, {zeroPadded: false})
    if (t == '0W')
      return getWeekNumber(now, {zeroPadded: true})
    if (t == 'DD')
      return now.getUTCDate()
    if (t == '0D') {
      const dd = now.getUTCDate()
      return (dd < 10 ? '0' : '') + dd
    }
  }

  function getWeekNumber(date, opts={zeroPadded: false}) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const daynum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - daynum)
    const yearstart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    const result = Math.ceil((((d - yearstart) / 86400000) + 1)/7)
    return opts.zeroPadded && result < 10 ? '0' + result : result
  }

  function getYear() {
    const year = getLiveValue('YYYY')
    const yearbase = parseInt(year.toString().slice(0, 1)) * 1000
    if (dateversion.hasOwnProperty('YYYY')) return parseInt(dateversion.YYYY)
    if (dateversion.hasOwnProperty('YY')) return parseInt(dateversion.YY) + yearbase
    if (dateversion.hasOwnProperty('0Y')) return parseInt(dateversion['0Y']) + yearbase
    return parseInt(year)
  }

  function getMonth() {
    const m = dateversion.hasOwnProperty('MM') ? parseInt(dateversion.MM) :
              dateversion.hasOwnProperty('0M') ? parseInt(dateversion['0M']) :
              1;
    return m - 1;
  }

  function getDay() {
    const m = dateversion.hasOwnProperty('DD') ? parseInt(dateversion.DD) :
              dateversion.hasOwnProperty('0D') ? parseInt(dateversion['0D']) :
              1;
    return m;
  }

  function asNumeric() {
    return Date.UTC(getYear(), getMonth(), getDay())
  }

  function inc(level, multipleLevels=false) {
    if (updated === false && alltags.modifier.indexOf(level) !== -1) updated = true
    if (level != 'CALENDAR') return;

    updated = false
    for (let i = 0; i < tags.length; i++) {
      const t = tags[i]
      const lv = getLiveValue(t)
      if (dateversion[t] != lv) updated = true
      dateversion[t] = lv
    }

    if (updated === false && multipleLevels === false) {
      throw new Error('There is no change in the version.')
    }

    return updated
  }

  function asString() {
    //if (updated === false && verarr.length > 0)
      //throw new Error('There is no change in the version.');

    return Object.keys(dateversion).map(t => dateversion[t]).join('.')
  }

  function pretty(locale=undefined) {
    return new Date(asNumeric()).toLocaleString(locale, {year: 'numeric', month: 'long'})
  }

  return {
    inc: inc,
    asString: asString,
    asNumeric: asNumeric,
    pretty: pretty
  }
}
