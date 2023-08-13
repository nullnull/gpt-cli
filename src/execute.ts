import chalk from 'chalk'
import { GptCliArgs } from './index.js'
import { executeChatTask } from './tasks/executeChatTask.js'
import { executeReplaceFileTask } from './tasks/executeReplaceFileTask.js'
import { openFile } from './util.js'
import { executeCommandTask } from './tasks/executeCommandTask.js'
import { loadConfig } from './config/loadConfig.js'
import { logger } from './logger.js'
import { CONSTANT } from './constant.js'

export async function execute({ prompt, ...options }: GptCliArgs) {
  if (options.verbose) {
    logger.settings.minLevel = 3
  }
  // TODO: help, version

  const config = await loadConfig()
  if (config.openaiApiKey === undefined) {
    console.log(chalk.yellow('[WARNING] You must set your own api key. Please run `ai auth sk-xxxxxxxx`'))
    console.log(chalk.yellow('You can get your own API KEY from https://platform.openai.com/account/api-keys/'))
    console.log(chalk.yellow('...But now, you can use our free api key to try this tool. Enjoy! ✨'))
  }
  const apiKey = config.openaiApiKey ?? CONSTANT.freeOpenaiApiKey

  if (prompt === undefined) {
    console.log(chalk.red('[ERROR] please input prompt'))
    process.exit(1)
  }

  // コマンドの実行
  if (options.type === 'command') {
    await executeCommandTask({
      apiKey,
      config,
      prompt,
      execute: options.execute,
      interaction: options.interaction,
      explanation: options.explanation,
    })
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
      console.log(chalk.red('[ERROR] --file option is required for --write option'))
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
