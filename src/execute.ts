import chalk from 'chalk'
import { GptCliArgs } from '.'
import { executeChatTask } from './tasks/executeChatTask'

export async function execute({ prompt }: GptCliArgs) {
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

  // 単純にプロンプトを返す
  const reply = executeChatTask({ apiKey, prompt })
  console.log(reply)
  process.exit(0)
}
