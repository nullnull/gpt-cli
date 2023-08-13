import chalk from 'chalk'
import inquirer from 'inquirer'

import { createChatCompletion } from '../createChatCompletion.js'
import { logger } from '../logger.js'
import { execCommand } from '../util.js'
import { z } from 'zod'
import { json } from 'stream/consumers'
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

# 出力形式
1行目にコマンドを、改行を2つ以上あけてから解説文を記述してください。
今後の全ての指示において、絶対にこの形式で返事をしてください。例外はありません。

# 例
## 指示の例
jsファイルを一覧表示してください。
## 出力例
find . -name *.js

findコマンドは、UNIXおよびLinuxシステムにおいて、指定したディレクトリからファイルやディレクトリを検索するためのコマンドです。
様々なオプションと組み合わせて、ファイル名、ファイルタイプ、ファイルサイズ、更新日などの基準で検索が可能です。
-nameオプションは、ファイル名やディレクトリ名に基づいて検索を行うためのオプションです。

# 実行環境
OS: ${process.platform}

次に指示を送ります。`,
      role: 'user' as const,
    },
    {
      content: prompt,
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
  logger.info(res)
  const reply = res.choices[0]?.message
  if (reply === undefined || reply.content === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  const parsed = parseReply(reply.content)
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
      console.log(`🤖 Executed`)
      break
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

  // after run
  if (choiceValidated === 'run') {
    const { choice2 } = await inquirer.prompt({
      type: 'list',
      name: 'choice2',
      default: true,
      message: `🤖 What will you do next?`,
      choices: [
        {
          name: '👋 Quit',
          value: 'quit',
        },
        {
          name: '🔁 Input further instructions',
          value: 'continue',
        },
        {
          name: '📋 Copy',
          value: 'copy',
        },
      ],
    })
    switch (choice2) {
      case 'copy': {
        // TODO
        // clipboard.writeSync(parsed.command)
        return
      }
      case 'quit': {
        return
      }
    }
  }

  // continue
  const { additionalPrompt } = await inquirer.prompt({
    type: 'input',
    name: 'additionalPrompt',
    message: `🤖 Please input further instructions`,
  })
  if (['q', 'quit', ''].includes(additionalPrompt)) {
    return
  }
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

function parseReply(reply: string) {
  const [command, ...xs] = reply.split(/\n\s*\n/)
  return {
    command,
    explanation: xs.join('\n\n'),
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
