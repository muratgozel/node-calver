# node-calver

Calendar based software versioning library as node.js module and with cli support. 📅

## What is calendar based versioning?

It's a way of tagging software state based on in combination of a chosen calendar tags such as YYYY, MM, DD. The chosen tags convey the message of how frequently the software gets major updates, to the user. It doesn't tell anything about breaking changes (there is [git-diff](https://git-scm.com/docs/git-diff) for that) but it tells when the next major release will come.

I recommend [this article by Donald Stufft](https://caremad.io/posts/2016/02/versioning-software/) to read more about versioning softwares and [this website by Mahmoud Hashemi](https://calver.org) to learn more about calendar versioning.

## What does it look like?

The format consist of two parts. The calendar part and the minor changes counter. The calendar part describes software's release cycle. The minor part is just a counter over the main release. Take **2024-4.104** for example; the year and the month separated by a dash and the minor counter separated by a dot. So the general template for the format is `YYYY-MM-DD.MINOR`. One might choose:

-   YYYY for yearly release cycle
-   YYYY-MM for monthly release cycle
-   YYYY-WW for weekly release cycle
-   YYYY-MM-DD for daily release cycle

The releases sent before the next release time period, counts as minor changes and therefore it increments the minor part of the version.

## Prerequisites

-   What is your release cycle? Decide how frequently you will release your software. Excluding minor changes such as security fixes or other kind of features and fixes.

## Install

```sh
npm i -D calver
# or
pnpm add -D calver
```

## Usage

The library can be used both as a node.js module and a cli app. Both usages documented below per feature.

### Library defaults

There are some defaults to keep in mind while using node-calver.

-   Minor counter is 0 by default and it's hidden from the output if it's zero.
-   The values of calendar tags computed based on UTC time.
-   The year always exists in the output and can't be omitted. The other tags is up to a user.
-   When month, week or day isn't specified, they are considered as zero and this is important when comparing dates.

### Cycles

Finds the next version based on release cycle.

```ts
import * as calver from 'calver'

calver.cycle('2024-4.204')
```

```sh
calver 2024-4.204
```

Depending on the date the code above executed, the output will be `2024-4.205`, `2024-5` or `2024-[current month]`.

It's capable to understand the format you chose with one exception.

```ts
calver.cycle('2024.204')
```

```sh
calver 2024.204
```

Outputs `2024.205` or `[current year]`.

The full year, month and day cycle:

```ts
calver.cycle('2024-4-16.204')
```

```sh
calver 2024-4-16.204
```

Outputs `2024-4-16.205` or `[current date as YYYY-MM-DD]`.

And the exception is weeks. A cycle option needs to be passed for weekly release cycles:

```ts
calver.cycle('2024-32.204', { cycle: 'week' })
```

```sh
calver 2024-32.204 --cycle week # or -c week
```

Outputs `2024-32.205` or `2024-[current week of the year]`.

### Minor releases

A minor method just increments the minor portion of the version and leaves the date portion as it is.

```ts
calver.minor('2024') // outputs 2024.1
```

```sh
calver 2024 --minor # outputs 2024.1
```

```ts
calver.minor('2024.204') // outputs 2024.205
```

```sh
calver 2024.204 --minor # outputs 2024.205
```

```ts
calver.minor('2024-4-16.204') // outputs 2024-4-16.205
```

```sh
calver 2024-4-16.204 --minor # outputs 2024-4-16.205
```

and so on.

### Create an initial version

```ts
calver.initial({ cycle: 'month' })
```

```sh
calver initial --cycle month
```

Outputs `[current year]-[current month]`.

### Valid

```ts
calver.valid('2024-4.123')
// provide cycle for more strict check
calver.valid('2024-4.123', { cycle: 'month' })
```

Outputs a `boolean`.

```sh
calver valid 2024-4.123
# or specify --cycle flag for more strict check
calver valid --cycle month
```

Outputs the exact version string or exits with error.

### Comparison

```ts
// newer than
calver.nt('2024-4-20', '2024-4-19') // true
calver.nt('2024-4-20', '2024') // true
calver.nt('2024', '2024-4-20') // false

// older than
calver.ot('2024-4-20', '2024-4-19') // false
calver.ot('2024-4-20', '2024') // false
calver.ot('2024', '2024-4-20') // true

// speciy cycle if you use weeks
calver.nt('2024-32', '2024-30', { cycle: 'week' }) // true
```

Returns a `boolean`

```sh
calver nt 2024-4-20 2024-4-19
calver ot 2024-4-20 2024-4-19
calver nt 2024-32 2024-30 --cycle week
```

Outputs the exact version string or exits with error.

## Contributing

If you're interested in contributing, read the [CONTRIBUTING.md](https://github.com/muratgozel/muratgozel/blob/main/CONTRIBUTING.md) first, please.

---

Version management of this repository done by [releaser](https://github.com/muratgozel/node-releaser) 🚀

---

Thanks for watching 🐬

[![Support me on Patreon](https://cdn.muratgozel.com.tr/support-me-on-patreon.v1.png)](https://patreon.com/muratgozel?utm_medium=organic&utm_source=github_repo&utm_campaign=github&utm_content=join_link)
