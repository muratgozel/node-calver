# node-calver | The Calendar Versioner
The calver parser for node. 📆 🚀

![NPM](https://img.shields.io/npm/l/calver)
[![npm version](https://badge.fury.io/js/calver.svg)](https://badge.fury.io/js/calver)
![npm bundle size](https://img.shields.io/bundlephobia/min/calver)
![npm](https://img.shields.io/npm/dy/calver)

## Why
Yes, [semantic versioning](https://semver.org/) isn't the only versioning scheme. Software developers are versioning their software for decades and there are various schemes. [Calendar versioning](https://calver.org/) is one of them. It has a bit more flexible when compared to semver. It's based on dates and more human-readable. Personally, using it in my frontend projects and it's working pretty well.

## Implementation
There is no standart (as much in semver) about the implementation of calendar versioning. The introduction in [calver.org](https://calver.org/) inspired me a lot and I build the API flexible enough for user to create versions in various formats.

## Install
This is node.js module and compiled for `cjs` and `es` module environments. There is no dependency and it can be installed via npm:
```sh
npm i calver
```

## Usage
Require or import:
```js
const calver = require('calver')
// or
import calver from 'calver'
```
If your `node < 14` then:
```js
const calver = require('calver/node/lts')
// or
import calver from 'calver/node/lts'
```

Unlike semver, calver needs a `format` to deal with version strings. 

### Choose Format
A format is a recipe for calver to decide what will the next version be. In semver, format is fixed (MAJOR.MINOR.PATCH.MODIFIER) but in calver you create your own version format by using available tags.

| Tag       | Type      | Description |
| ---       | ---       | --- |
| YYYY      | calendar  | Zero based year with max 4 digit. |
| YY        | calendar  | Zero based year with max 2 digit. |
| 0Y        | calendar  | Zero padded 2 digit year. |
| MM        | calendar  | Zero based month with max 2 digit. |
| 0M        | calendar  | Zero padded 2 digit month. |
| WW        | calendar  | Zero based week of the year with max 2 digit. |
| 0W        | calendar  | Zero padded 2 digit week of the year. |
| DD        | calendar  | Zero based day of the month with max 2 digit. |
| 0D        | calendar  | Zero padded 2 digit day of the month. |
| MAJOR     | semantic  | Auto-increment number for breaking changes. |
| MINOR     | semantic  | Auto-increment number for new features. |
| PATCH     | semantic  | Auto-increment number for bug fixes. |
| DEV       | modifier  | Auto-increment number for dev updates. |
| ALPHA     | modifier  | Auto-increment number for alpha updates. |
| BETA      | modifier  | Auto-increment number for beta updates. |
| RC        | modifier  | Auto-increment number for release candidate updates. |

You can combine any of these tags while choosing a format except modifiers. Let's say we choose:
```js
const format = 'yyyy.mm.minor.patch'
```
and create an initial release:
```js
// assuming current date is 2021.01
const version = calver.inc(format, '', 'calendar')
// version = 2021.1.0.0
```
The second argument is previous version string that we would like to increment but left empty to show to create an initial version.

The third argument is the level of the increment operation. `level` might be one of the following:

| Level                         | Type      | Description |
| ---                           | ---       | --- |
| calendar                      | calendar  | Updates calendar tags to the current date and removes modifier if it exist. |
| major                         | semantic  | Increments the major tag, resets minor, patch tags and removes modifier if it exist. |
| minor                         | semantic  | Increments the minor tag, resets the patch tag and removes modifier if it exist. |
| patch                         | semantic  | Increments tha patch tag and removes modifier if it exist. |
| dev                           | modifier  | Increments the dev tag. |
| alpha                         | modifier  | Increments the alpha tag. |
| beta                          | modifier  | Increments the beta tag. |
| rc                            | modifier  | Increments the rc tag. |
| calendar.[dev,alpha,beta,rc]  | composite | Updates calendar tags and adds specified modifier tag. |
| major.[dev,alpha,beta,rc]     | composite | Increments the major tag and adds specified modifier tag. |
| minor.[dev,alpha,beta,rc]     | composite | Increments the minor tag and adds specified modifier tag. |
| patch.[dev,alpha,beta,rc]     | composite | Increments the patch tag and adds specified modifier tag. |

### Increment
Let's make some more updates:
```js
// assuming current date is 2021.01

const version = calver.inc(format, '2021.1.0.0', 'minor.dev')
// version = 2021.1.1.0-dev.0

const version = calver.inc(format, '2021.1.1.0-dev.0', 'dev')
// version = 2021.1.1.0-dev.1

const version = calver.inc(format, '2021.1.1.0-dev.1', 'dev')
// version = 2021.1.1.0-dev.2

const version = calver.inc(format, '2021.1.1.0-dev.2', 'alpha')
// version = 2021.1.1.0-alpha.0

const version = calver.inc(format, '2021.1.1.0-alpha.0', 'alpha')
// version = 2021.1.1.0-alpha.1

const version = calver.inc(format, '2021.1.1.0-alpha.1', 'minor')
// version = 2021.1.1.0

const version = calver.inc(format, '2021.1.1.0', 'minor')
// version = 2021.1.2.0

const version = calver.inc(format, '2021.1.2.0', 'patch')
// version = 2021.1.2.1
```

To create an initial version, just leave the version field empty:
```js
const version = calver.inc(format, '', 'calendar') // 2021.1.0.0
```

To increment based on both calendar and semantic tags:
```js
const version = calver.inc('yy.mm.minor', '', 'calendar.minor') // 2021.1.0
const version = calver.inc('yy.mm.minor', '2021.1.0', 'calendar.minor') // 2021.1.1
```

### Validation
Test the input if it is valid against a format:
```js
calver.isValid('yyyy.mm.0w', '2020.6.1') === false // because 0W can't be "1", it should be "01"
calver.isValid('yyyy.mm.minor.patch', '0.0.0.1') === false // because YYYY and MM can't be "0"
```

## Tests
```js
npm run test
```
Note that the `Date.now()` function replaced with a fixed value in tests so we can reliably run tests whenever we want.

## Note
Software versioning is hard. None of the schemes are working perfectly and currently it highly depends on the how you are going to use. See [this article written by donald stufft](https://caremad.io/posts/2016/02/versioning-software/).

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
