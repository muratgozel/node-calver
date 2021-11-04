export default class DateVersion {
  static tags = ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D']

  constructor(obj, parentSeperator) {
    this['YYYY'] = null
    this['YY'] = null
    this['0Y'] = null
    this['MM'] = null
    this['0M'] = null
    this['WW'] = null
    this['0W'] = null
    this['DD'] = null
    this['0D'] = null

    this.parentSeperator = parentSeperator
    this.props = []
    this.date = new Date(Date.now())

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      this[prop] = obj[prop]
      this.props.push(prop)
    }
  }

  inc(level) {
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

    return this
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
