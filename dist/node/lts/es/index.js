class DateVersion {
  static tags = ['YYYY', 'YY', '0Y', 'MM', '0M', 'WW', '0W', 'DD', '0D'];
  reDigits = /[^0-9]/;

  constructor(obj, parentSeperator, isInitialVersion) {
    this['YYYY'] = null;
    this['YY'] = null;
    this['0Y'] = null;
    this['MM'] = null;
    this['0M'] = null;
    this['WW'] = null;
    this['0W'] = null;
    this['DD'] = null;
    this['0D'] = null;
    this.hasChanged = false;
    this.isInitialVersion = isInitialVersion;
    this.parentSeperator = parentSeperator;
    this.props = [];
    this.date = new Date(Date.now());
    this.parse(obj);
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Calendar tag ${prop} has an invalid value "${obj[prop]}"`);
      }

      this[prop] = obj[prop];
      this.props.push(prop);
    }
  }

  inc(level) {
    const prevValue = this.asString();
    const yearstr = this.date.getUTCFullYear().toString();
    this['YYYY'] = yearstr;
    this['YY'] = parseInt(yearstr.slice(2)).toString();
    this['0Y'] = this['YY'].padStart(2, '0');
    const monthstr = (this.date.getUTCMonth() + 1).toString();
    this['MM'] = monthstr;
    this['0M'] = this['MM'].padStart(2, '0');
    const weekstr = this.getUTCWeek(this.date).toString();
    this['WW'] = weekstr;
    this['0W'] = this['WW'].padStart(2, '0');
    const daystr = this.date.getUTCDate().toString();
    this['DD'] = daystr;
    this['0D'] = this['DD'].padStart(2, '0');
    const newValue = this.asString();
    this.hasChanged = prevValue != newValue;
    return this;
  }

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false;

    switch (prop) {
      case 'YYYY':
        if (v.slice(0, 1) == '0') return false;
        return v.length === 4;

      case 'YY':
        if (v.slice(0, 1) == '0') return false;
        return v.length === 1 || v.length === 2 || v.length === 3;

      case '0Y':
        if ((v.length == 2 || v.length == 3) && v.slice(0, 1) == '0') return false;
        return v.length === 2 || v.length === 3;

      case 'MM':
        return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].indexOf(Number(v)) !== -1;

      case '0M':
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].indexOf(v) !== -1;

      case 'WW':
        return Number(v) >= 1 && Number(v) <= 52;

      case '0W':
        if (v.length != 2) return false;
        return Number(v) >= 1 && Number(v) <= 52;

      case 'DD':
        return Number(v) >= 1 && Number(v) <= 31;

      case '0D':
        if (v.length != 2) return false;
        return Number(v) >= 1 && Number(v) <= 31;
    }
  }

  asObject() {
    return this.props.reduce((memo, prop) => {
      memo[prop] = this[prop];
      return memo;
    }, {});
  }

  asString() {
    const result = [];

    for (const tag of this.constructor.tags) {
      if (this.props.indexOf(tag) !== -1) result.push(this[tag]);
    }

    return result.join(this.parentSeperator);
  }

  getUTCWeek(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const daynum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - daynum);
    const yearstart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - yearstart) / 86400000 + 1) / 7);
  }

}

class SemanticVersion {
  static tags = ['MAJOR', 'MINOR', 'PATCH'];
  reDigits = /[^0-9]/;

  constructor(obj, parentSeperator, isInitialVersion) {
    this.MAJOR = null;
    this.MINOR = null;
    this.PATCH = null;
    this.isInitialVersion = isInitialVersion;
    this.parentSeperator = parentSeperator;
    this.props = [];
    this.parse(obj);
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Semantic tag ${prop} has an invalid value "${obj[prop]}"`);
      }

      this[prop] = obj[prop];
      this.props.push(prop);
    }
  }

  reset() {
    this.props.map(prop => this[prop] = 0);
  }

  inc(level) {
    if (this.props.indexOf(level) === -1) {
      throw new Error(`[CALVER]: You have requested to increment "${level}" but your format doesn't have it.`);
    }

    if (level == 'MAJOR') {
      this.MAJOR = (parseInt(this.MAJOR) + 1).toString();
      if (this.props.indexOf('MINOR') !== -1) this.MINOR = '0';
      if (this.props.indexOf('PATCH') !== -1) this.PATCH = '0';
    }

    if (level == 'MINOR') {
      this.MINOR = (parseInt(this.MINOR) + 1).toString();
      if (this.props.indexOf('PATCH') !== -1) this.PATCH = '0';
    }

    if (level == 'PATCH') {
      this.PATCH = (parseInt(this.PATCH) + 1).toString();
    }

    return this;
  }

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false;
    return true;
  }

  asObject() {
    return this.props.reduce((memo, prop) => {
      memo[prop] = this[prop];
      return memo;
    }, {});
  }

  asString() {
    const result = [];

    for (const tag of this.constructor.tags) {
      if (this.props.indexOf(tag) !== -1) result.push(this[tag]);
    }

    return result.join(this.parentSeperator);
  }

}

class ModifierVersion {
  static seperator = '-';
  static tags = ['DEV', 'ALPHA', 'BETA', 'RC'];
  reDigits = /[^0-9\-]/;

  constructor(obj, parentSeperator, isInitialVersion) {
    this.DEV = null;
    this.ALPHA = null;
    this.BETA = null;
    this.RC = null;
    this.isInitialVersion = isInitialVersion;
    this.parentSeperator = parentSeperator;
    this.prop = null;
    this.parse(obj);
  }

  parse(obj) {
    for (const prop in obj) {
      if (!this.isInitialVersion && !this.isValid(prop, obj[prop])) {
        throw new Error(`Modifier tag ${prop} has an invalid value "${obj[prop]}"`);
      }

      this.prop = prop;
      this[prop] = obj[prop];
    }
  }

  inc(level) {
    if (level != this.prop) {
      throw new Error(`[CALVER]: You have requested to increment "${level}" but your format doesn't have it.`);
    }

    this[this.prop] = (parseInt(this[this.prop]) + 1).toString();
    return this;
  }

  isValid(prop, v) {
    if (!v || typeof v != 'string' || this.reDigits.test(v)) return false;
    if (v.indexOf('-') !== -1 && v != '-1') return false;
    return true;
  }

  asObject() {
    const result = {};
    result[this.prop] = this[this.prop];
    return result;
  }

  asString() {
    return `${this.constructor.seperator}${this.prop}${this.parentSeperator}${this[this.prop]}`;
  }

}

class Version {
  constructor(version, seperator) {
    this.seperator = seperator;
    this.versionStringHasModifier = version.versionStringHasModifier;
    this.isInitialVersion = version.isInitialVersion;
    this.isCalendarLeading = version.isCalendarLeading;
    this.datever = null;
    this.semanticver = null;
    this.modifierver = null;
    this.parse(version);
  }

  parse(version) {
    if (Object.keys(version.calendar).length > 0) {
      this.datever = new DateVersion(version.calendar, this.seperator, this.isInitialVersion);
    }

    if (Object.keys(version.semantic).length > 0) {
      this.semanticver = new SemanticVersion(version.semantic, this.seperator, this.isInitialVersion);
    }

    if (Object.keys(version.modifier).length > 0) {
      this.modifierver = new ModifierVersion(version.modifier, this.seperator, this.isInitialVersion);
    }
  }

  inc(levels) {
    const l = levels[0];
    const removeModifier = levels.length === 1 && ['MAJOR', 'MINOR', 'PATCH', 'CALENDAR'].indexOf(l) !== -1 && this.versionStringHasModifier;

    if (removeModifier) {
      this.modifierver = null;
      return this;
    }

    if (l == 'CALENDAR') this.datever.inc(l);
    if (SemanticVersion.tags.indexOf(l) !== -1) this.semanticver.inc(l);
    if (ModifierVersion.tags.indexOf(l) !== -1) this.modifierver.inc(l);

    if (levels.length > 1) {
      const l2 = levels[1];

      if (ModifierVersion.tags.indexOf(l2) !== -1 && ModifierVersion.tags.indexOf(l) === -1) {
        this.modifierver.inc(l2);
      } else if (SemanticVersion.tags.indexOf(l2) !== -1) {
        if (this.isCalendarLeading && this.datever.hasChanged) this.semanticver.reset();else this.semanticver.inc(l2);
      } else {
        throw new Error(`The second tag of the level should be either modifier or semantic tag. You specified "${l2}" as the second tag and "${l}" as the first tag.`);
      }
    }

    return this;
  }

  asObject() {
    const result = {
      calendar: {},
      semantic: {},
      modifier: {}
    };
    if (this.datever) result.calendar = this.datever.asObject();
    if (this.semanticver) result.semantic = this.semanticver.asObject();
    if (this.modifierver) result.modifier = this.modifierver.asObject();
    return result;
  }

}

class Calver {
  constructor() {
    this.seperator = '.';
    this.levels = ['CALENDAR', 'MAJOR', 'MINOR', 'PATCH', ...ModifierVersion.tags];
  }

  inc(format, version, levels) {
    levels = this.validateLevels(levels);
    format = this.validateFormat(format, levels);
    const parsedVersion = this.parseVersion(version, format, levels);
    const obj = new Version(parsedVersion, this.seperator).inc(levels).asObject();
    const result = this.asString(format, obj);

    if (version == result) {
      throw new Error('No change happened in the version.');
    }

    return result;
  }

  isValid(format, version) {
    if (!version) return false;

    try {
      format = this.validateFormat(format, []);
      version = this.parseVersion(version, format, []);
      new Version(version, this.seperator);
      return true;
    } catch (e) {
      return false;
    }
  }

  getTagType(tag) {
    tag = tag.toUpperCase();
    if (DateVersion.tags.indexOf(tag) !== -1) return 'calendar';
    if (SemanticVersion.tags.indexOf(tag) !== -1) return 'semantic';
    if (ModifierVersion.tags.indexOf(tag) !== -1) return 'modifier';
    return undefined;
  }

  asString(format, obj) {
    const result = [];

    for (const tag of format.sorted) {
      if (DateVersion.tags.indexOf(tag) !== -1) {
        result.push(obj.calendar[tag]);
      }

      if (SemanticVersion.tags.indexOf(tag) !== -1) {
        result.push(obj.semantic[tag]);
      }

      if (ModifierVersion.tags.indexOf(tag) !== -1 && obj.modifier) {
        result.push(ModifierVersion.seperator + tag.toLowerCase() + this.seperator + obj.modifier[tag]);
      }
    }

    return result.join(this.seperator).replace(this.seperator + ModifierVersion.seperator, ModifierVersion.seperator);
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
    };
    let startIndex = 0,
        endIndex = 0;

    for (const tag of format.sorted) {
      endIndex = version.indexOf(this.seperator, startIndex + 1);
      if (endIndex === -1) endIndex = undefined;
      let value = version.slice(startIndex, endIndex);

      if (value.indexOf(ModifierVersion.seperator) !== -1) {
        endIndex = version.indexOf(ModifierVersion.seperator, startIndex + 1);
        value = version.slice(startIndex, endIndex);
      }

      if (ModifierVersion.tags.indexOf(value.toUpperCase()) !== -1) {
        if (value.toUpperCase() != tag) value = '-1';else value = version.slice(startIndex + value.length + 1);
      }

      if (isNaN(startIndex)) {
        value = ModifierVersion.tags.indexOf(tag) !== -1 ? '-1' : '0';
      }

      if (value == '') {
        value = '0';
      }

      map.sorted[tag] = value;
      if (format.calendar.indexOf(tag) !== -1) map.calendar[tag] = value;
      if (format.semantic.indexOf(tag) !== -1) map.semantic[tag] = value;
      if (format.modifier.indexOf(tag) !== -1) map.modifier[tag] = value;
      startIndex = endIndex + 1;
    }

    return map;
  }

  validateFormat(format, levels) {
    const result = {
      sorted: [],
      calendar: [],
      semantic: [],
      modifier: []
    };
    const tags = format.toUpperCase().split(this.seperator);

    for (const tag of tags) {
      if (DateVersion.tags.indexOf(tag) !== -1) result.calendar.push(tag);else if (SemanticVersion.tags.indexOf(tag) !== -1) result.semantic.push(tag);else throw new Error(`[CALVER]: Invalid format tag "${tag}".`);
      result.sorted.push(tag);
    }

    for (const level of levels) {
      if (ModifierVersion.tags.indexOf(level) !== -1) {
        result.modifier.push(level);
        result.sorted.push(level);
      }
    }

    result.isCalendarLeading = DateVersion.tags.indexOf(result.sorted[0]) !== -1;
    return result;
  }

  validateLevels(levels) {
    const result = [];
    const arr = levels.split('.');

    for (const level of arr) {
      const formatted = level.toUpperCase();

      if (this.levels.indexOf(formatted) !== -1) {
        result.push(formatted);
      } else {
        throw new Error(`[CALVER]: Invalid level "${level}".`);
      }
    }

    return result;
  }

}

var index = new Calver();

export { index as default };
//# sourceMappingURL=index.js.map
