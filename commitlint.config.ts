import { type UserConfig } from '@commitlint/types'
import conventional from '@commitlint/config-conventional'

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // 'build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'
        'type-enum': [2, 'always', [...conventional.rules['type-enum'][2]]],
    },
}

export default config
