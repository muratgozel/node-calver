function Calver(format, version) {
  this.value = {}
  this.format = ''
  this.formatTagsDate = ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D']
  this.formatTagsSemantic = ['MAJOR', 'MINOR', 'MICRO', 'MODIFIER']
  this.validFormatTags = [].concat(this.formatTagsDate).concat(this.formatTagsSemantic)
  this.defaultIncTag = undefined
  this.reMatcher = /[0-9]+([0-9.]+)?/g
  this.reTester = /[^0-9.]/g
  this.setFormat(format)
  this.set(version)
}

Calver.prototype.inc = function inc(inctag = undefined) {
  if (typeof inctag == 'string') inctag = inctag.toUpperCase()
  const now = new Date()
  const tags = this.format.split('.')
  const newValue = {}
  let
    areAllDateTagsEqual = true
    areAllSemanticTagsEqual = true
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    newValue[tag] = this.getTagValue(tag, now)
    if (newValue[tag] !== this.value[tag]) {
      if (this.formatTagsDate.indexOf(tag) !== -1) areAllDateTagsEqual = false
      if (this.formatTagsSemantic.indexOf(tag) !== -1) areAllSemanticTagsEqual = false
    }
  }

  if (areAllDateTagsEqual === false) {
    this.value = newValue
    if (this.value.hasOwnProperty('MAJOR')) this.value.MAJOR = 0
    if (this.value.hasOwnProperty('MINOR')) this.value.MINOR = 0
    if (this.value.hasOwnProperty('MICRO')) this.value.MICRO = 0
    return this;
  }

  if (this.defaultIncTag) inctag = this.defaultIncTag

  if (areAllSemanticTagsEqual === true && typeof inctag != 'string')
    throw new Error('Specify a semantic tag to increment.')

  if (areAllSemanticTagsEqual === true && this.formatTagsSemantic.indexOf(inctag) === -1)
    throw new Error('Invalid semantic tag specified. ('+inctag+')')

  newValue[inctag] = newValue[inctag] + 1

  if (inctag == 'MAJOR') {
    newValue.MINOR = 0
    newValue.MICRO = 0
  }
  if (inctag == 'MINOR') newValue.MICRO = 0

  this.value = newValue

  return this;
}

Calver.prototype.get = function get() {
  if (this.format.length < 1)
    throw new Error('Couldn\'t get version. Invalid format.')

  const version = []
  const tags = this.format.split('.')
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    if (!this.value.hasOwnProperty(tag))
      throw new Error('Couldn\'t get version. The value of the tag ' + tag + ' not found.')
    version.push(this.value[tag])
  }
  return version.join('.')
}

Calver.prototype.gt = function gt(versionStr) {
  const compVersion = this.parse(versionStr, this.format)
  const tags = this.format.split('.')
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    if (this.formatTagsDate.indexOf(tag) !== -1) {
      const v1 = tag.slice(0, 1) == '0' ? parseInt(this.value[tag]) : this.value[tag]
      const v2 = tag.slice(0, 1) == '0' ? parseInt(compVersion[tag]) : compVersion[tag]
      if (v2 > v1) return false
      if (v1 > v2) return true
    }
    if (this.formatTagsSemantic.indexOf(tag) !== -1) {
      if (compVersion[tag] > this.value[tag]) return false
      if (this.value[tag] > compVersion[tag]) return true
    }
  }
  return false
}

Calver.prototype.lt = function lt(versionStr) {
  return !this.gt(versionStr)
}

Calver.prototype.valid = function valid(versionStr = undefined, format = '') {
  if (typeof versionStr == 'undefined') return false
  if (typeof versionStr == 'number') return versionStr.toString()
  if (typeof versionStr != 'string') return false
  if (this.reTester.test(versionStr) === true) return false
  if (format == '') return versionStr

  const parts = versionStr.split('.')
  const tags = format.split('.')
  if (parts.length != tags.length) return false

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    if (this.validateTagValue(tag, parseInt(parts[i])) !== true) return false
  }

  return versionStr
}

Calver.prototype.toSemver = function toSemver() {
  const tags = this.format.split('.')
  if (tags.length < 4) return this.get()
  const semver = []
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    semver.push(this.value[tag])
    if (i === 2) semver.push('+')
  }
  return semver.join('.').replace('.+.', '+')
}

Calver.prototype.validateTagValue = function validateTagValue(tag, value) {
  value = tag.slice(0, 1) == '0' ? parseInt(value) : value
  if (typeof value != 'number') return false

  switch (tag) {
    case 'YYYY': return value >= 1000 && value < 10000; break;
    case 'YY': return value >= 0 && value < 100; break;
    case '0Y': return value >= 0 && value < 100; break;
    case 'MM': return value >= 1 && value <= 12; break;
    case '0M': return value >= 1 && value <= 12; break;
    case 'WW': return value >= 1 && value <= 52; break;
    case '0W': return value >= 1 && value <= 52; break;
    case 'DD': return value >= 1 && value <= 31; break;
    case '0D': return value >= 1 && value <= 31; break;
    default: return value > 0 && Number.isInteger(value); break;
  }
}

Calver.prototype.parse = function parse(str, format) {
  const value = {}
  const parts = str.split('.')
  const tags = format.split('.')
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    value[tag] = tag.slice(0, 1) == '0' ? parts[i] : parseInt(parts[i])
  }
  return value
}

Calver.prototype.getTagValue = function getTagValue(tag, now) {
  switch (tag) {
    case 'YYYY': return now.getFullYear(); break;
    case 'YY': return parseInt(now.getFullYear().toString().slice(2)); break;
    case '0Y': return now.getFullYear().toString().slice(2); break;
    case 'MM': return now.getMonth() + 1; break;
    case '0M':
      const m = now.getMonth() + 1
      return (m < 10 ? '0' + m : m).toString(); break;
    case 'WW': return this.getWeekNumber(now, {zeroPadded: false}); break;
    case '0W': return this.getWeekNumber(now, {zeroPadded: true}); break;
    case 'DD': return now.getDate(); break;
    case '0D':
      const day = now.getDate();
      return (day < 10 ? '0' + day : day).toString(); break;
    case 'MAJOR': return this.value.hasOwnProperty(tag) ? this.value[tag] : 0; break;
    case 'MINOR': return this.value.hasOwnProperty(tag) ? this.value[tag] : 0; break;
    case 'MICRO': return this.value.hasOwnProperty(tag) ? this.value[tag] : 0; break;
    default:
      throw new Error('There is no such tag called '+tag+' supported.')
  }
}

Calver.prototype.setFormat = function setFormat(str) {
  if (typeof str != 'string')
    throw new Error('Couldn\'t set format. Type of the input must be a string.')

  if (this.format.length > 0)
    throw new Error('Format can not be changed after once set.')

  // force uppercase
  str = str.toUpperCase()

  // check for invalid tags
  const invalid = str.split('.').filter(tag => this.validFormatTags.indexOf(tag) === -1)
  if (Array.isArray(invalid) && invalid.length > 0)
    throw new Error('Couldn\'t set format. The following tags you specified are invalid: ' + invalid.join(', '))

  this.format = str

  return this
}

Calver.prototype.set = function set(version) {
  const tags = this.format.split('.')
  const isInitial = Object.keys(this.value).length === 0
  const semanticTags = []

  if (isInitial && typeof version == 'undefined') {
    const now = new Date()
    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      this.value[tag] = this.getTagValue(tag, now)
      if (this.formatTagsSemantic.indexOf(tag) !== -1) semanticTags.push(tag)
    }
    if (semanticTags.length === 1) this.defaultIncTag = semanticTags[0]
    return this;
  }

  if (typeof version == 'undefined')
    throw new Error('Specify a version.')

  const parts = version.split('.')
  if (parts.length != tags.length)
    throw new Error('Version and format doesn\'t match.')

  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    this.value[tag] = tag.slice(0, 1) == '0' ? parts[i] : parseInt(parts[i])
    if (this.formatTagsSemantic.indexOf(tag) !== -1) semanticTags.push(tag)
  }
  if (semanticTags.length === 1) this.defaultIncTag = semanticTags[0]

  return this
}

Calver.prototype.getWeekNumber = function getWeekNumber(date, opts = {zeroPadded: false}) {
  const onejan = new Date(date.getFullYear(), 0, 1)
  const number = Math.ceil( (((date - onejan) / 86400000) + onejan.getDay() + 1) / 7 )
  return opts.zeroPadded && number < 10 ? '0' + number :
    opts.zeroPadded === true ? number.toString() :
    number
}

Calver.prototype.clean = function clean(str) {
  if (typeof str != 'string')
    return ''

  const matches = str.match(this.reMatcher)
  if (Array.isArray(matches) && matches.length > 0)
    return matches[0]

  return ''
}

module.exports = Calver
