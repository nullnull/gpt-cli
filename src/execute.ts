import chalk from 'chalk'
import { GptCliArgs } from '.'
import { executeChatTask } from './tasks/executeChatTask'
import { executeReplaceFileTask } from './tasks/executeReplaceFileTask'

export async function execute({ prompt, ...options }: GptCliArgs) {
  // TODO: help, version

  const apiKey = process.env.OPENAI_API_KEY // TODO: move to configuration file
  if (apiKey === undefined) {
    console.log(chalk.red('OPENAI_API_KEY is required'))
    process.exit(1)
  }

  if (prompt === undefined) {
    console.log(chalk.red('prompt is required'))
    process.exit(1)
  }

  //
  // タスクごとに分岐
  //
  // ファイルの書き換え
  if (options.replace !== undefined) {
    await executeReplaceFileTask({ apiKey, prompt, filePath: options.replace, write: true })
    process.exit(0)
  }

  if (options.file !== undefined) {
    const reply = await executeReplaceFileTask({ apiKey, prompt, filePath: options.file, write: false })
    console.log(reply)
    process.exit(0)
  }

  // 単純にプロンプトを返す
  const reply = executeChatTask({ apiKey, prompt })
  console.log(reply)
  process.exit(0)
}
