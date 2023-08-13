import chalk from 'chalk'
import inquirer from 'inquirer'

import { createChatCompletion } from '../createChatCompletion'
import { logger } from '../logger'
import { execCommand } from '../util'
import { z } from 'zod'
// import clipboard from 'clipboardy'; // TODO

export async function executeCommandTask({
  apiKey,
  prompt,
  execute,
  interaction,
}: {
  apiKey: string
  prompt: string
  execute?: boolean
  interaction: boolean
}) {
  if (!interaction || execute) {
    await executeCommandTaskWithNoInteraction({ apiKey, prompt, execute })
    return
  }

  const messages = [
    {
      content: `これから行う指示に合わせて、コマンド生成してください。また、コマンドの解説文を生成してください。
返事は必ずJSONで返してください。必ず "command" と "explanation" を含めてください。JSONは次のような形式です。
---
指示:
jsファイルを一覧表示してください。
返答:
{"command": "find . -name *.js", "explanation": "findコマンドは、UNIXおよびLinuxシステムにおいて、指定したディレクトリからファイルやディレクトリを検索するためのコマンドです。様々なオプションと組み合わせて、ファイル名、ファイルタイプ、ファイルサイズ、更新日などの基準で検索が可能です。
-nameオプションは、ファイル名やディレクトリ名に基づいて検索を行うためのオプションです。"}
---

それでは、以下の指示を実行してください。
OS: ${process.platform}
指示：${prompt}`,
      role: 'user' as const,
    },
  ]
  await executeCommandTaskInteractive({ apiKey, messages })
}

type Message = {
  content: string
  role: 'user' | 'assistant'
}
async function executeCommandTaskInteractive({ apiKey, messages }: { apiKey: string; messages: Message[] }) {
  const res = await createChatCompletion(apiKey, messages)
  const reply = res.choices[0]?.message
  if (reply === undefined || reply.content === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  const parsed = parseJsonReply(reply.content)
  console.log(`${chalk.blueBright(`-----Command-----`)}
${parsed.command}

${chalk.blueBright(`----Explanation----`)}
${parsed.explanation}
  `)

  const { choice } = await inquirer.prompt({
    type: 'list',
    name: 'choice',
    default: true,
    message: `🤖 Would you like to execute this command?`,
    choices: [
      {
        name: '✅ Run this command',
        value: 'run',
      },
      {
        name: '🔁 Input further instructions',
        value: 'continue',
      },
      {
        name: '📋 Copy',
        value: 'copy',
      },
      {
        name: '❌ Cancel',
        value: 'cancel',
      },
    ],
  })
  logger.debug({ choice })
  const choiceValidated = z.enum(['run', 'continue', 'copy', 'cancel']).parse(choice)
  switch (choiceValidated) {
    case 'run': {
      await execCommand(parsed.command)
      return
    }
    case 'copy': {
      // TODO
      // clipboard.writeSync(parsed.command)
      return
    }
    case 'cancel': {
      return
    }
    default: {
      const x: 'continue' = choiceValidated
    }
  }

  // continue
  const { additionalPrompt } = await inquirer.prompt({
    type: 'input',
    name: 'additionalPrompt',
    message: `🤖 Please input further instructions`,
  })
  const parsedPrompt = z.string().parse(additionalPrompt)
  await executeCommandTaskInteractive({
    apiKey,
    messages: [
      ...messages,
      {
        role: 'assistant',
        content: reply.content,
      },
      {
        role: 'user',
        content: parsedPrompt,
      },
    ],
  })
}

const jsonReplySchema = z.object({
  command: z.string(),
  explanation: z.string(),
})
function parseJsonReply(json: string) {
  try {
    const parsed = JSON.parse(json)
    return jsonReplySchema.parse(parsed)
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`failed to parse gpt reply. message: ${json}`))
      console.log(chalk.red(e.message))
    }
    process.exit(1)
  }
}

async function executeCommandTaskWithNoInteraction({
  apiKey,
  prompt,
  execute,
}: {
  apiKey: string
  prompt: string
  execute?: boolean
}) {
  const res = await createChatCompletion(apiKey, [
    {
      content: `これから行う指示に合わせて、コマンドを生成してください。
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

  if (execute) {
    await execCommand(reply)
    return
  }

  console.log(reply)
}
