# node-calver | The Calendar Versioner
The calver parser for node. Because we love calendar versioning! 📆 🚀

![NPM](https://img.shields.io/npm/l/calver)
[![npm version](https://badge.fury.io/js/calver.svg)](https://badge.fury.io/js/calver)
![npm bundle size](https://img.shields.io/bundlephobia/min/calver)
![npm](https://img.shields.io/npm/dy/calver)

[Calendar versioning](https://calver.org/) is an alternative to [semantic versioning](https://semver.org/). They both have advantages to each other and used by popular softwares.

I wrote this module to apply calendar versioning to my frontend projects and it works well. Practically you can use calendar versioning anywhere. The semantic versioner's module [semver](https://github.com/npm/node-semver) inspired me a lot while writing this module. Hoping that developers will have more content to compare calendar versioning and semantic versioning and know that semantic versioning is not the only versioning standart.

## Install
```sh
npm i calver
```

## Before Using
You may want to look at [calver.org](https://calver.org/) which I used as a reference while implementing this package, to better understand implementing calendar versioning.

### Available Tags
Here are the list of tags you can use while creating a versioning scheme of your app.

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
Let's create an initial release:
```js
const calver = require('calver')

const format = 'yy.mm.minor.micro.dev'
calver.init(format)
```
This will return (based on the date you are executing) **21.1.0.0-dev.0**

After some infrastructural code, maybe:
```js
calver.inc(format, '21.1.0.0-dev.0', 'dev')
```
and we are going to have **21.1.0.0-dev.1**

Some time later we may go alpha:
```js
calver.inc(format, '21.1.0.0-dev.1', 'alpha')
```

It is now **21.1.0.0-alpha.0**

Then `beta` and then `rc`. Modifier tags work as shown above. Let's create a release:
```js
calver.inc(format, '21.1.0.0.rc.4', 'minor')
```

This will return **21.1.1.0** Note that the date portion never changes except you explicitly specify to. (going to show you below)

Made a few bug fixes:
```js
calver.inc(format, '21.1.1.0', 'micro')
calver.inc(format, '21.1.1.1', 'micro')
calver.inc(format, '21.1.1.2', 'micro')
calver.inc(format, '21.1.1.3', 'micro')
```

and we have **21.1.1.4**

Added new features:
```js
calver.inc(format, '21.1.1.4', 'minor')
```

and we now have **21.1.2.0**

Great. Now let's assume our developer decided to make a calendar release:
```js
calver.inc(format, '21.1.2.0', 'calendar.dev')
```

This will give (in a future date, assuming its April 2021) **21.4.0.0-dev.0**

and the alpha, beta, micro, minor updates... the whole circulation repeats.

The first parameter **format** is fixed along with the project lifetime. It is called **versioning scheme**. You can use tags as written in the list above.

The second parameter **version** is the current user defined value value of the **format**. (and `inc` will give you the next one)

The third parameter **level** explains the majority and purpose of the update.
1. It can be `calendar` to sync the date portion of the version with the current date.
2. It can be one of `major`, `minor` and `micro` to update the semantic portion of the version.
3. It can have two tags while the first one is one of the two above and the second one is a modifier. `calendar.alpha`, `minor.beta` for example.

### Validate Versions
You may want to validate a version string against a format:
```js
try {
  calver.valid('yyyy.mm.minor.modifier', '2021.5-alpha.1', 'minor')
} catch (e) {

}
```
It will throw since it doesn't have a `minor` tag in its version string.

### Prettify Version
Print more human readable, pretty versions:
```js
const pretty = calver.pretty('yyyy.mm.micro', '2021.3.24')
const pretty2 = calver.pretty('yyyy.mm.micro', '2021.3.24', 'tr')
```
The first one is **March 2021 (24)** and the second one is **Mart 2021 (24)**

## Tests
Tests are written in [jasmine](https://jasmine.github.io) and can be run with `npm run test`. You can browse spec folder to see more examples.

One thing to note that the `Date.now()` function is fixed in tests so we can reliably run tests whenever we want.

---

Thanks for watching 🐬

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/F1F1RFO7)
