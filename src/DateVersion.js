export default class DateVersion {
  static tags = ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D']

  reDigits = /[^0-9]/

  constructor(obj, parentSeperator, isInitialVersion) {
    this['YYYY'] = null
    this['YY'] = null
    this['0Y'] = null
    this['MM'] = null
    this['0M'] = null
    this['WW'] = null
    this['0W'] = null
    this['DD'] = null
    this['0D'] = null

    this.hasChanged = false
    this.isInitialVersion = isInitialVersion
    this.parentSeperator = parentSeperator
    this.props = []
    this.date = new Date(Date.now())

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Calendar tag ${prop} has an invalid value "${obj[prop]}"`)
      }

      this[prop] = obj[prop]
      this.props.push(prop)
    }
  }

  inc(level) {
    const prevValue = this.asString()

    const yearstr = this.date.getUTCFullYear().toString()
    this['YYYY'] = yearstr
    this['YY'] = parseInt(yearstr.slice(2)).toString()
    this['0Y'] = this['YY'].padStart(2, '0')

    const monthstr = (this.date.getUTCMonth() + 1).toString()
    this['MM'] = monthstr
    this['0M'] = this['MM'].padStart(2, '0')

    const weekstr = this.getUTCWeek(this.date).toString()
    this['WW'] = weekstr
    this['0W'] = this['WW'].padStart(2, '0')

    const daystr = this.date.getUTCDate().toString()
    this['DD'] = daystr
    this['0D'] = this['DD'].padStart(2, '0')

    const newValue = this.asString()

    this.hasChanged = prevValue != newValue

    return this
  }

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false

    switch (prop) {
      case 'YYYY':
        if (v.slice(0, 1) == '0') return false
        return v.length === 4
        break;

      case 'YY':
        if (v.slice(0, 1) == '0') return false
        return v.length === 1 || v.length === 2 || v.length === 3
        break;

      case '0Y':
        if ((v.length == 2 || v.length == 3) && v.slice(0, 1) == '0') return false
        return v.length === 2 || v.length === 3
        break;

      case 'MM':
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(Number(v)) !== -1
        break;

      case '0M':
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
          .indexOf(v) !== -1
        break;

      case 'WW':
        return Number(v) >= 1 && Number(v) <= 52
        break;

      case '0W':
        if (v.length != 2) return false
        return Number(v) >= 1 && Number(v) <= 52
        break;

      case 'DD':
        return Number(v) >= 1 && Number(v) <= 31
        break;

      case '0D':
        if (v.length != 2) return false
        return Number(v) >= 1 && Number(v) <= 31
        break;
    }
  }

  asObject() {
    return this.props.reduce((memo, prop) => {
      memo[prop] = this[prop]
      return memo
    }, {})
  }

  asString() {
    const result = []
    for (const tag of this.constructor.tags) {
      if (this.props.indexOf(tag) !== -1) result.push(this[tag])
    }
    return result.join(this.parentSeperator)
  }

  getUTCWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const daynum = d.getUTCDay() || 7

    d.setUTCDate(d.getUTCDate() + 4 - daynum)

    const yearstart = new Date( Date.UTC(d.getUTCFullYear(), 0, 1) )

    return Math.ceil((((d - yearstart) / 86400000) + 1)/7)
  }
}
