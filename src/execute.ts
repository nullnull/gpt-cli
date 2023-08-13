import chalk from 'chalk'
import { GptCliArgs } from './index.js'
import { executeChatTask } from './tasks/executeChatTask.js'
import { executeReplaceFileTask } from './tasks/executeReplaceFileTask.js'
import { openFile } from './util.js'
import { executeCommandTask } from './tasks/executeCommandTask.js'
import { loadConfig } from './config/loadConfig.js'
import { logger } from './logger.js'

export async function execute({ prompt, ...options }: GptCliArgs) {
  if (options.verbose) {
    logger.settings.minLevel = 3
  }
  // TODO: help, version

  const config = await loadConfig()
  const apiKey = config.openaiApiKey
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
    await executeCommandTask({ apiKey, config, prompt, execute: options.execute, interaction: options.interaction })
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
    await executeReplaceFileTask({ apiKey, config, prompt, fileBody, filePath, write: true })
    process.exit(0)
  }

  // 単純にプロンプトを返す
  // ファイル、標準入力があればそれも指定する
  const reply = await executeChatTask({
    apiKey,
    config,
    prompt,
    extraContent: fileBody ?? options.stdin,
    minimal: options.minimal,
  })
  console.log(reply)
  process.exit(0)
}
