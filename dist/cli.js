#!/usr/bin/env node
import { Command } from 'commander'
import {
    CALVER_CYCLES,
    cycle,
    initial,
    valid,
    nt,
    ot,
    isCycleValid,
} from './index.js'

var name = 'calver'
var version = '24.0.0'
var description =
    'Calendar based software versioning library as node.js module and with cli support.'
var type = 'module'
var main = './dist/index.js'
var types = './dist/index.d.ts'
var bin = {
    calver: './dist/cli.js',
}
var scripts = {
    build: 'pkgroll --target=es2020 --target=node16 --clean-dist',
    format: 'prettier --write --ignore-unknown .',
    lint: 'eslint .',
    test: 'vitest run',
    prepare: 'husky',
}
var exports = {
    require: {
        types: './dist/index.d.cts',
        default: './dist/index.cjs',
    },
    import: {
        types: './dist/index.d.ts',
        default: './dist/index.js',
    },
}
var files = ['dist/*', 'package.json']
var browserslist = ['defaults', '> 0.1%', 'ie 10', 'not ie 9']
var repository = {
    type: 'git',
    url: 'git+https://github.com/muratgozel/node-calver.git',
}
var keywords = ['calver', 'calendar', 'versioning', 'semver']
var author = {
    name: 'Murat Gözel',
    email: 'murat@gozel.com.tr',
    url: 'https://gozel.com.tr',
}
var funding = {
    type: 'patreon',
    url: 'https://patreon.com/muratgozel',
}
var license = 'MIT'
var bugs = {
    url: 'https://github.com/muratgozel/node-calver/issues',
}
var homepage = 'https://github.com/muratgozel/node-calver#readme'
var devDependencies = {
    '@commitlint/cli': '^19.3.0',
    '@commitlint/config-conventional': '^19.2.2',
    '@commitlint/types': '^19.0.3',
    '@eslint/js': '^9.3.0',
    eslint: '^9.3.0',
    husky: '^9.0.11',
    'lint-staged': '^15.2.2',
    'node-releaser': '^2.1.4',
    pkgroll: '^2.1.0',
    prettier: '^3.2.5',
    typescript: '^5.4.5',
    'typescript-eslint': '^7.9.0',
    vitest: '^1.6.0',
}
var dependencies = {
    commander: '^12.0.0',
}
var pkg = {
    name: name,
    version: version,
    description: description,
    type: type,
    main: main,
    types: types,
    bin: bin,
    scripts: scripts,
    exports: exports,
    files: files,
    'lint-staged': {
        '**/*': 'prettier --write --ignore-unknown .',
    },
    browserslist: browserslist,
    repository: repository,
    keywords: keywords,
    author: author,
    funding: funding,
    license: license,
    bugs: bugs,
    homepage: homepage,
    devDependencies: devDependencies,
    dependencies: dependencies,
}

const program = new Command()
program.name(pkg.name).description(pkg.description).version(pkg.version)
program
    .command('cycle', { isDefault: true })
    .argument('<string>', 'version string')
    .option(
        '-c, --cycle <string>',
        'release cycle. one of ' + CALVER_CYCLES.join(', '),
        parseCycleArg,
        'auto',
    )
    .action((str, options) => {
        const next = cycle(str, { cycle: options.cycle })
        console.log(next)
    })
program
    .command('initial')
    .requiredOption(
        '-c, --cycle <string>',
        'release cycle. one of ' + CALVER_CYCLES.join(', '),
        parseCycleArgStrict,
    )
    .action((options) => {
        const initialVersion = initial({ cycle: options.cycle })
        console.log(initialVersion)
    })
program
    .command('valid')
    .argument('<string>', 'version string')
    .option(
        '-c, --cycle <string>',
        'release cycle. one of ' + CALVER_CYCLES.join(', '),
        parseCycleArg,
        'auto',
    )
    .action((str, options) => {
        const validVersion = valid(str, { cycle: options.cycle })
        console.log(validVersion)
    })
program
    .command('nt')
    .argument('<string>', 'version string')
    .argument('<string>', 'version string')
    .option(
        '-c, --cycle <string>',
        'release cycle. one of ' + CALVER_CYCLES.join(', '),
        parseCycleArg,
        'auto',
    )
    .action((str, str2, options) => {
        const isNewer = nt(str, str2, { cycle: options.cycle })
        if (!isNewer) {
            throw new Error(
                'The version ' + str + ' is not newer than the ' + str2,
            )
        }
        console.log(str)
    })
program
    .command('ot')
    .argument('<string>', 'version string')
    .argument('<string>', 'version string')
    .option(
        '-c, --cycle <string>',
        'release cycle. one of ' + CALVER_CYCLES.join(', '),
        parseCycleArg,
        'auto',
    )
    .action((str, str2, options) => {
        const isNewer = ot(str, str2, { cycle: options.cycle })
        if (!isNewer) {
            throw new Error(
                'The version ' + str + ' is not older than the ' + str2,
            )
        }
        console.log(str)
    })
program.parse()
function parseCycleArg(value) {
    if (!isCycleValid(value)) {
        throw new Error(
            'Invalid release cycle: the valid values are ' +
                CALVER_CYCLES.join(', '),
        )
    }
    return value
}
function parseCycleArgStrict(value) {
    if (!isCycleValid(value, false)) {
        throw new Error(
            'Invalid release cycle: the valid values are ' +
                CALVER_CYCLES.filter((v) => v !== 'auto').join(', '),
        )
    }
    return value
}
