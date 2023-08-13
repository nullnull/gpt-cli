import chalk from 'chalk'
import inquirer from 'inquirer'

import { createChatCompletion } from '../createChatCompletion.js'
import { logger } from '../logger.js'
import { execCommand } from '../util.js'
import { z } from 'zod'
import clipboard from 'clipboardy'
import { GptCliConfig } from '../config/loadConfig.js'
import Mustache from 'mustache'
import { fixedPrompt } from '../prompt/prompt.js'

export async function executeCommandTask({
  apiKey,
  config,
  prompt,
  execute,
  interaction,
  explanation,
}: {
  apiKey: string
  config: GptCliConfig
  prompt: string
  execute?: boolean
  interaction: boolean
  explanation: boolean
}) {
  if (!interaction || execute) {
    await executeCommandTaskWithNoInteraction({ apiKey, config, prompt, execute })
    return
  }

  const messages = [
    explanation
      ? {
          content: Mustache.render(fixedPrompt.ja.commandWithExplanation, { platform: process.platform }),
          role: 'user' as const,
        }
      : {
          content: Mustache.render(fixedPrompt.ja.commandWithoutExplanation, { platform: process.platform }),
          role: 'user' as const,
        },
    {
      content: prompt,
      role: 'user' as const,
    },
  ]
  await executeCommandTaskInteractive({ apiKey, config, messages, explanation })
}

type Message = {
  content: string
  role: 'user' | 'assistant'
}
async function executeCommandTaskInteractive({
  apiKey,
  config,
  messages,
  explanation,
}: {
  apiKey: string
  config: GptCliConfig
  messages: Message[]
  explanation: boolean
}) {
  const res = await createChatCompletion(apiKey, config, messages)
  logger.info(res)
  const reply = res.choices[0]?.message
  if (reply === undefined || reply.content === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  const parsed = parseReply(reply.content)
  console.log(
    explanation
      ? `${chalk.blueBright(`-----Command-----`)}
${parsed.command}

${chalk.blueBright(`----Explanation----`)}
${parsed.explanation}
  `
      : parsed.command,
  )

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
      clipboard.writeSync(parsed.command)
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
        clipboard.writeSync(parsed.command)
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
    message: `🤖 Any tweaks?`,
  })
  if (['q', 'quit', ''].includes(additionalPrompt)) {
    return
  }
  const parsedPrompt = z.string().parse(additionalPrompt)
  await executeCommandTaskInteractive({
    apiKey,
    config,
    explanation,
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
  config,
  prompt,
  execute,
}: {
  apiKey: string
  config: GptCliConfig
  prompt: string
  execute?: boolean
}) {
  const res = await createChatCompletion(apiKey, config, [
    {
      content: Mustache.render(fixedPrompt.ja.commandWithoutExplanation, { platform: process.platform }),
      role: 'user' as const,
    },
    {
      content: prompt,
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
