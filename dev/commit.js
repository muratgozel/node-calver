#!/usr/bin/env node
const {exec, execSync} = require('child_process')
const fs = require('fs')
const path = require('path')
const cli = require('yargs')()
const colors = require('colors')
const calver = require('../src')

let pkgjson = undefined

function validateCodebaseChanges() {
  const output = execSync('git status -s')
  const changes = output.toString().split(/[\r\n]/).filter(line => line.trim().length > 0)
  if (!changes || changes.length < 1) {
    throw new Error('No change detected in the codebase.')
  }
}

function readCurrentVersion() {
  pkgjson = JSON.parse(fs.readFileSync('./package.json', 'utf8'))
  return pkgjson.version
}

function genNextVersion(scheme, currentVersion, level) {
  switch (scheme) {
    case 'semver':
      return semver.inc(currentVersion, level)
    break;
    case 'calver':
      const format = 'YY.MM.MICRO'
      return calver.inc(format, currentVersion, level)
    default:
      throw new Error('Unsupported versioning scheme.')
  }
}

function updatePKGJson(version) {
  pkgjson.version = version
  fs.writeFileSync('./package.json', JSON.stringify(pkgjson, null, 2))
}

function revertPKGJson(version) {
  updatePKGJson(version)
}

function commit(argv) {
  const {level, message, branch, publish} = argv

  validateCodebaseChanges()

  const currentVersion = readCurrentVersion()
  const nextVersion = genNextVersion('calver', currentVersion, level)

  updatePKGJson(nextVersion)

  const commitMessages = Array.isArray(message) ? message : [message]
  const commitMessagesCommand = '-m "' + commitMessages.join('" -m "') + '"'
  const commands = [
    'git tag -a "' + nextVersion + '" ' + commitMessagesCommand,
    'git add .',
    'git commit ' + commitMessagesCommand,
    'git push -u origin ' + branch + ' --tags'
  ]
  for (let i = 0; i < commands.length; i++) {
    try {
      execSync(commands[i], {stdio: 'inherit', encoding: 'utf8'})
    } catch (e) {
      revertPKGJson(currentVersion)
      throw e
    }
  }

  if (publish) {
    try {
      execSync('npm publish --access public', {stdio: 'inherit', encoding: 'utf8'})
    } catch (e) {
      revertPKGJson(currentVersion)
      throw e
    }
  }

  console.log('New version ' + nextVersion + ' released successfully.'.green)
}

cli
  .usage('Usage: npm run commit -- [level] [message] [branch] [publish]')
  .command(
    'commit',
    'Commits changes to a remote repo.',
    {
      level: {
        alias: 'l',
        describe: 'The calver compatible level of the commit.',
        demandOption: true
      },
      message: {
        alias: 'm',
        describe: 'A commit message. Can be specified multiple',
        demandOption: true
      },
      branch: {
        alias: 'b',
        describe: 'The branch name you are committing.',
        default: 'master'
      },
      publish: {
        alias: 'p',
        type: 'boolean',
        describe: 'Also publish on npm by executing the command "npm publish --access public".',
        default: false
      }
    },
    commit
  )

cli.parse(process.argv.slice(2))
