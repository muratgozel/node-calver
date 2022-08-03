export default class ModifierVersion {
  static seperator = '-'
  static tags = ['DEV', 'ALPHA', 'BETA', 'RC']

  reDigits = /[^0-9\-]/

  constructor(obj, parentSeperator, isInitialVersion) {
    this.DEV = null
    this.ALPHA = null
    this.BETA = null
    this.RC = null

    this.isInitialVersion = isInitialVersion
    this.parentSeperator = parentSeperator
    this.prop = null

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Modifier tag ${prop} has an invalid value "${obj[prop]}"`)
      }

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

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false
    if (v.indexOf('-') !== -1 && v != '-1') return false
    return true
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
