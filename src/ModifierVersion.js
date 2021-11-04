export default class ModifierVersion {
  static seperator = '-'
  static tags = ['DEV', 'ALPHA', 'BETA', 'RC']

  constructor(obj, parentSeperator) {
    this.DEV = null
    this.ALPHA = null
    this.BETA = null
    this.RC = null

    this.parentSeperator = parentSeperator
    this.prop = null

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      this.prop = prop
      this[prop] = obj[prop]
    }
  }

  inc(level) {
    if (level != this.prop) {
      throw new Error(`[CALVER]: You have requested to increment "${level}" but your format doesn't have it.`)
    }

    this[this.prop] = (parseInt(this[this.prop]) + 1).toString()

    return this
  }

  asObject() {
    const result = {}
    result[this.prop] = this[this.prop]
    return result
  }

  asString() {
    return `${this.constructor.seperator}${this.prop}${this.parentSeperator}${this[this.prop]}`
  }
}
