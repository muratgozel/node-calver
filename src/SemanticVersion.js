export default class SemanticVersion {
  static tags = ['MAJOR', 'MINOR', 'PATCH']

  constructor(obj, parentSeperator) {
    this.MAJOR = null
    this.MINOR = null
    this.PATCH = null

    this.parentSeperator = parentSeperator
    this.props = []

    this.parse(obj)
  }

  parse(obj) {
    for (const prop in obj) {
      this[prop] = obj[prop]
      this.props.push(prop)
    }
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
