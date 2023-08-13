import chalk from 'chalk'
import { GptCliArgs } from '.'
import { executeChatTask } from './tasks/executeChatTask'
import { executeReplaceFileTask } from './tasks/executeReplaceFileTask'
import { openFile } from './util'
import { executeCommandTask } from './tasks/executeCommandTask'

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

  // コマンドの実行
  if (options.type === 'command') {
    await executeCommandTask({ apiKey, prompt, execute: options.execute, interaction: options.interaction })
    process.exit(0)
  }

  const filePath = options.file
  const fileBody = filePath !== undefined ? await openFile(filePath) : undefined

  //
  // タスクごとに分岐
  //
  // ファイルの書き換えタスク
  if (options.write) {
    if (filePath === undefined || fileBody === undefined) {
      console.log(chalk.red('file is required'))
      process.exit(1)
    }
    await executeReplaceFileTask({ apiKey, prompt, fileBody, filePath, write: true })
    process.exit(0)
  }

  // 単純にプロンプトを返す
  // ファイル、標準入力があればそれも指定する
  const reply = await executeChatTask({
    apiKey,
    prompt,
    extraContent: fileBody ?? options.stdin,
    minimal: options.minimal,
  })
  console.log(reply)
  process.exit(0)
}
