import chalk from 'chalk'
import { readFile, writeFile } from 'fs/promises'

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
