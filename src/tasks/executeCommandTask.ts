import chalk from 'chalk'
import inquirer from 'inquirer'

import { createChatCompletion } from '../createChatCompletion'
import { logger } from '../logger'
import { execCommand } from '../util'

export async function executeCommandTask({
  apiKey,
  prompt,
  force,
  minimum,
}: {
  apiKey: string
  prompt: string
  force?: boolean
  minimum?: boolean
}) {
  const res = await createChatCompletion(apiKey, [
    {
      content: `これから行う指示に合わせて、コマンドを実行してください。
コマンド以外を返事に含めないでください。
OS: ${process.platform}
指示：${prompt}`,
      role: 'user' as const,
    },
  ])
  const reply = res.choices[0]?.message?.content
  if (reply === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }

  if (minimum !== true) {
    console.log(`🤖 ${reply}`)
  }
  if (force) {
    await execCommand(reply)
    return reply
  }

  const { answer } = await inquirer.prompt({
    type: 'confirm',
    name: 'answer',
    default: true,
    message: `🤖 Would you like to execute this command?`,
  })
  logger.debug({ answer })
  if (answer === true) {
    await execCommand(reply)
  }
  return reply
}
