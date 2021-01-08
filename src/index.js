function Calver(format, initialVersion) {
  this.validDateTags = ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D']
  this.validSemanticTags = ['MAJOR', 'MINOR', 'MICRO'] // TODO add MODIFIER
  this.reVersionMatcher = /[0-9]+([0-9.]+)?/g
  this.now = new Date()

  this.format = null
  this.hasSemanticTag = null
  this.validateFormat(format)

  this.semanticTags = []
  this.value = null
  if (typeof initialVersion == 'string' && initialVersion.length > 0) this.parse(initialVersion)
  else this.createInitialVersion()
}

Calver.prototype.inc = function inc(semanticTag = null, preserveDate = false) {
  if (typeof semanticTag == 'string') semanticTag = semanticTag.toUpperCase()

  let isDateTagChanged = false
  if(!preserveDate) {
    this.value = Object.keys(this.value).reduce(function (memo, tag) {
      if (this.validDateTags.indexOf(tag) !== -1) {
        const v = this.getTagDefaultValue(tag)
        if (v != this.value[tag] && isDateTagChanged === false) isDateTagChanged = true
        memo[tag] = v
      } else {
        memo[tag] = isDateTagChanged === true ? 0 : this.value[tag]
      }
      return memo
    }.bind(this), {})
  }

  if(isDateTagChanged){
    this.semanticTags.forEach(tag=> this.value[tag] = 0)
  }else if (typeof semanticTag == 'string' && this.validSemanticTags.indexOf(semanticTag) !== -1) {
    if (!this.hasSemanticTag || !this.value.hasOwnProperty(semanticTag)) throw new Error('Couldn\'t increment semantic tag '+semanticTag+' because version doesn\'t have such tag.')

    this.value[semanticTag] = parseInt(this.value[semanticTag]) + 1

    const semanticInd = this.validSemanticTags.indexOf(semanticTag)
    if (semanticInd < this.validSemanticTags.length - 1) {
      for (let i = semanticInd + 1; i < this.validSemanticTags.length; i++) {
        const nextSemanticTag = this.validSemanticTags[i]
        if (this.value.hasOwnProperty(nextSemanticTag)) this.value[nextSemanticTag] = 0
      }
    }
    isDateTagChanged=true
  }

  // in favor of https://github.com/muratgozel/node-calver/issues/2
  if (isDateTagChanged === false && this.semanticTags.length === 1) {
    return this.inc(this.semanticTags[0])
  }

  return this
}

Calver.prototype.get = function get() {
  const self = this
  return Object.keys(self.value).reduce(function(memo, tag) {
    memo = memo.concat([self.value[tag]])
    return memo
  }, []).join('.')
}

Calver.prototype.gt = function gt(versionStr) {
  versionStr = this.clean(versionStr)
  const ins = new Calver(this.format, versionStr)
  const tags = this.format.split('.')
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i]
    const v1 = parseInt(this.value[tag])
    const v2 = parseInt(ins.value[tag])
    if (v1 > v2) return true
    if (v1 < v2) return false
  }
  return false
}

Calver.prototype.lt = function lt(versionStr) {
  return !this.gt(versionStr)
}

Calver.prototype.valid = function valid(str, format) {
  if (typeof str != 'string' || typeof format != 'string')
    throw new Error('Version and format arguments must be string.')

  try {
    const ins = new Calver(format, str)
    return true
  } catch (e) {
    return false
  }
}

Calver.prototype.clean = function clean(str) {
  if (typeof str != 'string') return ''
  const arr = str.match(this.reVersionMatcher)
  return arr && arr.length > 0 ? arr[0] : ''
}

Calver.prototype.validateFormat = function validateFormat(format) {
  format = format.toUpperCase()
  const arr = format.split('.')
  const invalidTags = arr.filter(
    item => this.validDateTags.indexOf(item) === -1 && this.validSemanticTags.indexOf(item) === -1
  )
  if (invalidTags && invalidTags.length > 0)
    throw new Error('The format you specified contains invalid tags. (' + invalidTags.join(', ') + ')')

  const countDateTags = arr.filter(item => this.validDateTags.indexOf(item) !== -1)
  if (!countDateTags || countDateTags.length === 0)
    throw new Error('The format you specified should have at least one date tag.')

  const repeatingTags = arr.filter((tag, i, self) => self.indexOf(tag) !== i)
  if (repeatingTags && repeatingTags.length > 0)
    throw new Error('Using the same tag more than once is not allowed.')

  const countSemanticTags = arr.filter(item => this.validSemanticTags.indexOf(item) !== -1)
  this.hasSemanticTag = countSemanticTags && countSemanticTags.length > 0

  this.format = format
}

Calver.prototype.parse = function parse(str) {
  const self = this

  str = self.clean(str)
  const strtags = str.split('.')
  const formattags = self.format.split('.')
  if (formattags.length !== strtags.length)
    throw new Error('The version string '+str+' doesn\'t match with the format you specified. '+self.format)

  self.value = formattags.reduce(function(memo, tag, i) {
    memo[tag] = self.matchTagValue(tag, strtags[i])
    if (memo[tag] === undefined)
      throw new Error('Invalid value found in version string. The value '+strtags[i]+' is not in the format '+tag)
    return memo
  }, {})

  self.semanticTags = formattags.filter(function(t) {
    return self.validSemanticTags.indexOf(t) !== -1
  })

  return self
}

Calver.prototype.matchTagValue = function matchTagValue(tag, val) {
  if (typeof val == 'number') val = val.toString()
  if (/[^0-9]/g.test(val) === true) return undefined

  const validMonthValues = Array(12).fill(1).map((item, ind) => ind + 1)
  const validWeekValues = Array(52).fill(1).map((item, ind) => ind + 1)
  const validDayValues = Array(31).fill(1).map((item, ind) => ind + 1)

  switch (tag) {
    case 'YYYY':
      return /[0-9]{4}/g.test(val) === true && val.length === 4 ? val : undefined
    break;
    case 'YY':
      return /[0-9]{1,3}/g.test(val) === true && val.length >= 1 && val.length <= 3 ? val : undefined
    break;
    case 'MM':
      return validMonthValues.indexOf(parseInt(val)) !== -1 && val.slice(0, 1) != '0' ? val : undefined
    break;
    case '0M':
      return validMonthValues.indexOf(parseInt(val)) !== -1 && val.length === 2 ? val : undefined
    break;
    case 'WW':
      return validWeekValues.indexOf(parseInt(val)) !== -1 && val.slice(0, 1) != '0' ? val : undefined
    break;
    case '0W':
      return validWeekValues.indexOf(parseInt(val)) !== -1 && val.length === 2 ? val : undefined
    break;
    case 'DD':
      return validDayValues.indexOf(parseInt(val)) !== -1 && val.slice(0, 1) != '0' ? val : undefined
    break;
    case '0D':
      return validDayValues.indexOf(parseInt(val)) !== -1 && val.length === 2 ? val : undefined
    break;
    case 'MAJOR':
    case 'MINOR':
    case 'MICRO':
      return parseInt(val) >= 0 ? val : undefined
    break;
    default:
      return undefined
  }
}

Calver.prototype.createInitialVersion = function createInitialVersion() {
  const self = this
  const formattags = self.format.split('.')

  self.value = formattags.reduce(function(memo, tag, i) {
    memo[tag] = self.getTagDefaultValue(tag)
    return memo
  }, {})

  self.semanticTags = formattags.filter(function(t) {
    return self.validSemanticTags.indexOf(t) !== -1
  })

  return self
}

Calver.prototype.getTagDefaultValue = function getTagDefaultValue(tag) {
  const fullyear = this.now.getUTCFullYear()

  switch (tag) {
    case 'YYYY':
      return fullyear;
    break;
    case 'YY':
      return parseInt(fullyear.toString().slice(1))
    break;
    case 'MM':
      return this.now.getUTCMonth() + 1
    break;
    case '0M':
      const m = this.now.getUTCMonth() + 1
      return (m < 10 ? '0' + m : m).toString()
    break;
    case 'WW':
      return this.getWeekNumber(this.now, {zeroPadded: false})
    break;
    case '0W':
      return this.getWeekNumber(this.now, {zeroPadded: true})
    break;
    case 'DD':
      return this.now.getUTCDate()
    break;
    case '0D':
      const day = now.getUTCDate();
      return (day < 10 ? '0' + day : day).toString()
    break;
    case 'MAJOR': return 0; break;
    case 'MINOR': return 0; break;
    case 'MICRO': return 0; break;
    default:
      throw new Error('There is no such tag called '+tag+' supported by node-calver.')
  }
}

Calver.prototype.getWeekNumber = function getWeekNumber(date, opts = {zeroPadded: false}) {
  const onejan = new Date(date.getUTCFullYear(), 0, 1)
  const number = Math.ceil( (((date - onejan) / 86400000) + onejan.getUTCDay() + 1) / 7 )
  return opts.zeroPadded && number < 10 ?
    '0' + number :
    opts.zeroPadded === true ?
      number.toString() :
      number
}

module.exports = Calver
