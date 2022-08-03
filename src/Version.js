import DateVersion from './DateVersion.js'
import SemanticVersion from './SemanticVersion.js'
import ModifierVersion from './ModifierVersion.js'

export default class Version {
  constructor(version, seperator) {
    this.seperator = seperator
    this.versionStringHasModifier = version.versionStringHasModifier
    this.isInitialVersion = version.isInitialVersion
    this.isCalendarLeading = version.isCalendarLeading
    this.datever = null
    this.semanticver = null
    this.modifierver = null

    this.parse(version)
  }

  parse(version) {
    if (Object.keys(version.calendar).length > 0) {
      this.datever = new DateVersion(version.calendar, this.seperator, this.isInitialVersion)
    }

    if (Object.keys(version.semantic).length > 0) {
      this.semanticver = new SemanticVersion(version.semantic, this.seperator, this.isInitialVersion)
    }

    if (Object.keys(version.modifier).length > 0) {
      this.modifierver = new ModifierVersion(version.modifier, this.seperator, this.isInitialVersion)
    }
  }

  inc(levels) {
    const l = levels[0]

    const removeModifier = levels.length === 1 
      && ['MAJOR', 'MINOR', 'PATCH', 'CALENDAR'].indexOf(l) !== -1 
      && this.versionStringHasModifier
    if (removeModifier) {
      this.modifierver = null

      return this
    }

    if (l == 'CALENDAR') this.datever.inc(l)
    if (SemanticVersion.tags.indexOf(l) !== -1) this.semanticver.inc(l)
    if (ModifierVersion.tags.indexOf(l) !== -1) this.modifierver.inc(l)

    if (levels.length > 1) {
      const l2 = levels[1]

      if (ModifierVersion.tags.indexOf(l2) !== -1 && ModifierVersion.tags.indexOf(l) === -1) {
        this.modifierver.inc(l2)
      }
      else if (SemanticVersion.tags.indexOf(l2) !== -1) {
        if (this.isCalendarLeading && this.datever.hasChanged) this.semanticver.reset()
        else this.semanticver.inc(l2)
      }
      else {
        throw new Error(`The second tag of the level should be either modifier or semantic tag. You specified "${l2}" as the second tag and "${l}" as the first tag.`)
      }
    }

    return this
  }

  asObject() {
    const result = {
      calendar: {},
      semantic: {},
      modifier: {}
    }

    if (this.datever) result.calendar = this.datever.asObject()
    if (this.semanticver) result.semantic = this.semanticver.asObject()
    if (this.modifierver) result.modifier = this.modifierver.asObject()

    return result
  }
}
