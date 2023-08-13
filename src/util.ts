import chalk from 'chalk'
import { readFile } from 'fs/promises'
import childProcess from 'child_process'

export function isDevelopmentMode() {
  return process.env.GPT_CLI_DEBUG_MODE === 'true'
}

export async function openFile(filePath: string) {
  try {
    const fileBody = await readFile(filePath) // TODO: 相対パス、絶対パス、OSごとのを考慮して、これでいいんだろうか…？
    return fileBody.toString()
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`failed to open file`))
      console.log(chalk.red(e.message))
    }
    process.exit(1)
  }
}

export async function execCommand(cmd: string) {
  return new Promise((resolve) => {
    childProcess.exec(cmd, (error, stdout, stderr) => {
      console.log(stdout)
      if (error !== null) {
        console.log(chalk.red(error))
      }
      if (stderr !== null && stderr !== '') {
        console.log(chalk.red(stderr))
      }
      resolve(stdout)
    })
  })
}
