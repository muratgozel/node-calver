export default class SemanticVersion {
  static tags = ['MAJOR', 'MINOR', 'PATCH']

  reDigits = /[^0-9]/

  constructor(obj, parentSeperator, isInitialVersion) {
    this.MAJOR = null
    this.MINOR = null
    this.PATCH = null

    this.isInitialVersion = isInitialVersion
    this.parentSeperator = parentSeperator
    this.props = []

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Semantic tag ${prop} has an invalid value "${obj[prop]}"`)
      }

      this[prop] = obj[prop]
      this.props.push(prop)
    }
  }

  reset() {
    this.props.map(prop => this[prop] = 0)
  }

  inc(level) {
    if (this.props.indexOf(level) === -1) {
      throw new Error(`[CALVER]: You have requested to increment "${level}" but your format doesn't have it.`)
    }

    if (level == 'MAJOR') {
      this.MAJOR = (parseInt(this.MAJOR) + 1).toString()
      if (this.props.indexOf('MINOR') !== -1) this.MINOR = '0'
      if (this.props.indexOf('PATCH') !== -1) this.PATCH = '0'
    }
    
    if (level == 'MINOR') {
      this.MINOR = (parseInt(this.MINOR) + 1).toString()
      if (this.props.indexOf('PATCH') !== -1) this.PATCH = '0'
    }

    if (level == 'PATCH') {
      this.PATCH = (parseInt(this.PATCH) + 1).toString()
    }

    return this
  }

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false
    return true
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
}
