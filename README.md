# node-calver | The Calendar Versioner
The calver parser for node. Because we love calendar versioning! 💙🎈

![NPM](https://img.shields.io/npm/l/calver)
[![npm version](https://badge.fury.io/js/calver.svg)](https://badge.fury.io/js/calver)
![npm bundle size](https://img.shields.io/bundlephobia/min/calver)
![npm](https://img.shields.io/npm/dy/calver)

[Calendar versioning](https://calver.org/) is an alternative to [semantic versioning](https://semver.org/). They both have advantages to each other and used by popular softwares.

I wrote this module to do calendar versioning seamless and efficient in my projects. The semantic versioner's module [semver](https://github.com/npm/node-semver) inspired me a lot while writing this module. Hoping that developers will have more content to compare calendar versioning and semantic versioning and know that semantic versioning is not an only versioning standart.

## Install
```sh
npm i calver
```

## Use
Decide your format and you'r good to to.
```js
// get Calver prototype object
const Calver = require('calver')

// initiate a new versioner by specifiying a format
const calver = new Calver('YY.MM.MICRO')

// get the initial version
const initialVersion = calver.get()
// returns current year and month in utc and incremental semantic number. 20.5.0 for example.

// increment the active version
calver.inc()
// increments according to date or semantic tags.

// get current version
calver.get()
// 20.5.1 or 20.6.0 for example.

// compare with other version strings in the same format
calver.gt('20.4') // true
calver.lt('21.0') // true

// convert calver version into a semver parsable format
calver.toSemver()
```

### Helper Methods
There are helper methods to play with versions in a stateles way.
```js
// check if input is a valid calver version string
calver.valid('20.05') // '20.05'
calver.valid('a.b') // false
calver.valid('2020.5.333', 'YYYY.MM') // false, according to the format
calver.valid('2020.5.333', 'YYYY.MM.MICRO') // '2020.5.333'

// cleanup the version string.
calver.clean(', 20.05.3 ') // 20.05.3
```

## Available Format Tags
You can create your versioning scheme according to the following format tags:
1. **YYYY**
2. **YY**
3. **MM**
4. **0M**
5. **WW**
6. **0W**
7. **DD**
8. **0D**
9. **MAJOR**
10. **MINOR**
11. **MICRO**
The separator is **.** (dot).

The meanings of the tags are obvious and you can check them on calver.org.

## Notes
I would like extend the API as it be used by more developers. Current state of the API is enough for me. Let me know if you need more methods or functionality.

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
