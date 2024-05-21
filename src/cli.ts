import { Command } from 'commander'
import pkg from '../package.json'
import {
    isCycleValid,
    CALVER_CYCLES,
    cycle,
    valid,
    initial,
    nt,
    ot,
    prefix,
    suffix,
    clean,
    type CalVerCycle,
} from './index.js'

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
    .action((str: string, options: { cycle: CalVerCycle }) => {
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
    .action((options: { cycle: CalVerCycle }) => {
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
    .action((str: string, options: { cycle: CalVerCycle }) => {
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
    .action((str: string, str2: string, options: { cycle: CalVerCycle }) => {
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
    .action((str: string, str2: string, options: { cycle: CalVerCycle }) => {
        const isNewer = ot(str, str2, { cycle: options.cycle })
        if (!isNewer) {
            throw new Error(
                'The version ' + str + ' is not older than the ' + str2,
            )
        }
        console.log(str)
    })

program
    .command('prefix')
    .argument('<string>', 'version string')
    .option('--prefix <string>', 'The prefix.', 'v')
    .action((str: string, options: { prefix: string }) => {
        console.log(prefix(str, options.prefix))
    })

program
    .command('suffix')
    .argument('<string>', 'version string')
    .option('--suffix <string>', 'The suffix.')
    .action((str: string, options: { suffix: string }) => {
        console.log(suffix(str, options.suffix))
    })

program
    .command('clean')
    .argument('<string>', 'version string')
    .action((str: string) => {
        console.log(clean(str))
    })

program.parse()

function parseCycleArg(value: string) {
    if (!isCycleValid(value)) {
        throw new Error(
            'Invalid release cycle: the valid values are ' +
                CALVER_CYCLES.join(', '),
        )
    }
    return value
}

function parseCycleArgStrict(value: string) {
    if (!isCycleValid(value, false)) {
        throw new Error(
            'Invalid release cycle: the valid values are ' +
                CALVER_CYCLES.filter((v) => v !== 'auto').join(', '),
        )
    }
    return value
}
