import chalk from 'chalk'
import { GptCliArgs } from '.'
import { createChatCompletion } from './createChatCompletion'

export async function execute({ prompt }: GptCliArgs) {
  const apiKey = process.env.OPENAI_API_KEY // TODO: move to configuration file
  if (apiKey === undefined) {
    console.log(chalk.red('OPENAI_API_KEY is required'))
    process.exit(1)
  }

  if (prompt === undefined) {
    console.log(chalk.red('prompt is required'))
    process.exit(1)
  }

  // 単純にプロンプトを返す
  const res = await createChatCompletion(apiKey, [
    {
      content: prompt,
      role: 'user',
    },
  ])
  const reply = res.choices[0]?.message?.content
  if (reply === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  console.log(reply)
  process.exit(0)
}
