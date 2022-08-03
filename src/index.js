import DateVersion from './DateVersion.js'
import SemanticVersion from './SemanticVersion.js'
import ModifierVersion from './ModifierVersion.js'
import Version from './Version.js'

class Calver {
  constructor() {
    this.seperator = '.'
    this.levels = ['CALENDAR', 'MAJOR', 'MINOR', 'PATCH', ...ModifierVersion.tags]
  }

  inc(format, version, levels) {
    levels = this.validateLevels(levels)
    format = this.validateFormat(format, levels)
    const parsedVersion = this.parseVersion(version, format, levels)

    const obj = (new Version(parsedVersion, this.seperator)).inc(levels).asObject()

    const result = this.asString(format, obj)

    if (version == result) {
      throw new Error('No change happened in the version.')
    }

    return result
  }

  isValid(format, version) {
    if (!version) return false

    try {
      format = this.validateFormat(format, [])
      version = this.parseVersion(version, format, [])

      new Version(version, this.seperator)

      return true
    } catch (e) {
      return false
    }
  }

  getTagType(tag) {
    tag = tag.toUpperCase()

    if (DateVersion.tags.indexOf(tag) !== -1) return 'calendar'
    if (SemanticVersion.tags.indexOf(tag) !== -1) return 'semantic'
    if (ModifierVersion.tags.indexOf(tag) !== -1) return 'modifier'
    
    return undefined;
  }

  asString(format, obj) {
    const result = []

    for (const tag of format.sorted) {
      if (DateVersion.tags.indexOf(tag) !== -1) {
        result.push(obj.calendar[tag])
      }
      if (SemanticVersion.tags.indexOf(tag) !== -1) {
        result.push(obj.semantic[tag])
      }
      if (ModifierVersion.tags.indexOf(tag) !== -1 && obj.modifier) {
        result.push(ModifierVersion.seperator + tag.toLowerCase() + this.seperator + obj.modifier[tag])
      }
    }

    return result
      .join(this.seperator)
      .replace(this.seperator + ModifierVersion.seperator, ModifierVersion.seperator)
  }

  parseVersion(version, format, levels) {
    const map = {
      isCalendarLeading: format.isCalendarLeading,
      isInitialVersion: !version,
      versionStringHasModifier: /(dev|DEV|alpha|ALPHA|beta|BETA|rc|RC)/.test(version),
      sorted: {},
      calendar: {},
      semantic: {},
      modifier: {}
    }

    let startIndex=0, endIndex=0
    for (const tag of format.sorted) {
      endIndex = version.indexOf(this.seperator, startIndex+1)
      if (endIndex === -1) endIndex = undefined

      let value = version.slice(startIndex, endIndex)

      if (value.indexOf(ModifierVersion.seperator) !== -1) {
        endIndex = version.indexOf(ModifierVersion.seperator, startIndex+1)
        value = version.slice(startIndex, endIndex)
      }

      if (ModifierVersion.tags.indexOf(value.toUpperCase()) !== -1) {
        if (value.toUpperCase() != tag) value = '-1'
        else value = version.slice(startIndex + value.length + 1)
      }

      if (isNaN(startIndex)) {
        value = ModifierVersion.tags.indexOf(tag) !== -1 ? '-1' : '0'
      }

      if (value == '') {
        value = '0'
      }

      map.sorted[tag] = value
      if (format.calendar.indexOf(tag) !== -1) map.calendar[tag] = value
      if (format.semantic.indexOf(tag) !== -1) map.semantic[tag] = value
      if (format.modifier.indexOf(tag) !== -1) map.modifier[tag] = value

      startIndex = endIndex + 1
    }

    return map
  }

  validateFormat(format, levels) {
    const result = {
      sorted: [],
      calendar: [],
      semantic: [],
      modifier: []
    }

    const tags = format.toUpperCase().split(this.seperator)

    for (const tag of tags) {
      if (DateVersion.tags.indexOf(tag) !== -1) result.calendar.push(tag)
      else if (SemanticVersion.tags.indexOf(tag) !== -1) result.semantic.push(tag)
      else throw new Error(`[CALVER]: Invalid format tag "${tag}".`)

      result.sorted.push(tag)
    }

    for (const level of levels) {
      if (ModifierVersion.tags.indexOf(level) !== -1) {
        result.modifier.push(level)
        result.sorted.push(level)
      }
    }

    result.isCalendarLeading = DateVersion.tags.indexOf(result.sorted[0]) !== -1

    return result
  }

  validateLevels(levels) {
    const result = []
    const arr = levels.split('.')

    for (const level of arr) {
      const formatted = level.toUpperCase()
      if (this.levels.indexOf(formatted) !== -1) {
        result.push(formatted)
      }
      else {
        throw new Error(`[CALVER]: Invalid level "${level}".`)
      }
    }

    return result
  }
}

export default new Calver()
