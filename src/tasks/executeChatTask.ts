import chalk from 'chalk'
import { createChatCompletion } from '../createChatCompletion.js'
import { GptCliConfig } from '../config/loadConfig.js'
import Mustache from 'mustache'
import { fixedPrompt } from '../prompt/prompt.js'

export async function executeChatTask({
  apiKey,
  config,
  prompt,
  extraContent,
  filePath,
  minimal,
}: {
  apiKey: string
  config: GptCliConfig
  prompt: string
  extraContent?: string
  filePath?: string
  minimal?: boolean
}) {
  const messages =
    extraContent !== undefined
      ? [
          {
            content:
              filePath === undefined
                ? Mustache.render(fixedPrompt.ja.chatWithStdin, { prompt, minimal })
                : Mustache.render(fixedPrompt.ja.chatWithFile, { prompt, minimal, filePath }),
            role: 'user' as const,
          },
          {
            content: extraContent,
            role: 'user' as const,
          },
        ]
      : [
          {
            content: prompt,
            role: 'user' as const,
          },
        ]
  const res = await createChatCompletion(apiKey, config, messages)
  const reply = res.choices[0]?.message?.content
  if (reply === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  return reply
}
