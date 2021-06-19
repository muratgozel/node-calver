# node-calver | The Calendar Versioner
The calver parser for node. Because we love calendar versioning! 📆 🚀

![NPM](https://img.shields.io/npm/l/calver)
[![npm version](https://badge.fury.io/js/calver.svg)](https://badge.fury.io/js/calver)
![npm bundle size](https://img.shields.io/bundlephobia/min/calver)
![npm](https://img.shields.io/npm/dy/calver)

[Calendar versioning](https://calver.org/) is an alternative to [semantic versioning](https://semver.org/). They both have advantages to each other and used by popular softwares.

I wrote this module to apply calendar versioning to my frontend projects and it works well. Practically you can use calendar versioning anywhere. The semantic versioner's module [semver](https://github.com/npm/node-semver) inspired me a lot while writing this module. Hoping that developers will have more content to compare calendar versioning and semantic versioning and know that semantic versioning is not the only versioning standart.

There is no dependency.

## Install
```sh
npm i calver
```

## Before Using
You may want to look at [calver.org](https://calver.org/) which I used as a reference while implementing this package, to better understand how to build calendar versioner.

### Available Tags
Here are the list of tags you can choose while creating a versioning scheme of your app.

#### Date Tags
1. **YYYY**
2. **YY**
3. **0Y**
4. **MM**
5. **0M**
6. **WW**
7. **0W**
8. **DD**
9. **0D**

#### Semantic Tags
1. **MAJOR**
2. **MINOR**
3. **MICRO**
4. **MODIFIER**

#### Modifier Tags
1. **DEV**
2. **ALPHA**
3. **BETA**
4. **RC**

## Use
This is an example usage in some application releasing lifecycle.

We want our app's version in the following format: **yy.mm.minor.micro.modifier**

Give your app a version number for the next release:
```js
const calver = require('calver')

const format = 'yy.mm.minor.micro.modifier'
calver.inc(format, '21.1.0.0', 'dev')
```
This will return **21.1.0.0-dev.1**

When we done the changes and published this version, we can start to work on another update:
```js
// format is same and place the previous version number in the second argument
calver.inc(format, '21.1.0.0-dev.1', 'dev')
```
And we are now **21.1.0.0-dev.2**

When it is time to go alpha:
```js
// same logic
calver.inc(format, '21.1.0.0-dev.2', 'alpha')
```
And we are now alpha: **21.1.0.0-alpha.1**

Let's skip `beta` and `rs` tags and create a release version:
```js
// same same same
calver.inc(format, '21.1.0.0-alpha.1', 'minor')
```
And **21.1.1.0**

This is how a release cycles.

There is more options related to tags such as you can specify two tags:
```js
// calendar means update date portion to today.
calver.inc(format, '19.1.1.0', 'calendar.beta')
// returns 21.1.0.0-beta.1 depending on the current date

calver.inc(format, '21.1.1.0', 'minor.beta')
// returns 21.1.2.0-beta.1
```

The first parameter **format** is fixed along with the project. It is called **versioning scheme**. You can use tags as written in the list above.

The second parameter **version** is the current value of the **format**. (and `inc` will give you the next one)

The third parameter **level** explains the majority and purpose of the update.
1. It can be `calendar` to sync the date portion of the version with the current date.
2. It can be one of `major`, `minor` and `micro` to update the semantic portion of the version.
3. It can have two tags while the first one is one of the two above and the second one is either modifier or semantic. `calendar.alpha`, `minor.beta`, `calendar.micro` for example.

### Validate Versions
You may want to validate a version string against a format:
```js
try {
  calver.valid('yyyy.mm.minor.modifier', '2021.5-alpha.1')
} catch (e) {

}
```
It will throw since it doesn't have a `minor` tag in its version string.

### Prettify Version
Print more human readable, pretty versions:
```js
// month names are in english by default
const pretty = calver.pretty('yyyy.mm.micro', '2021.3.24', 'en')
// based on turkish
const pretty2 = calver.pretty('yyyy.mm.micro', '2021.3.24', 'tr')
// with modifier tags
const pretty3 = calver.pretty('yy.mm.micro.modifier', '21.3.4-alpha.1')
```
The first one is **March 2021 v24**, the second one is **Mart 2021 v24** and the third one is **March 2021 v4-alpha.1**

## Tests
Tests are written in [jasmine](https://jasmine.github.io) and can be run with `npm run test`. You can browse spec folder to see more examples.

One thing to note that the `Date.now()` function is fixed in tests so we can reliably run tests whenever we want.

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
