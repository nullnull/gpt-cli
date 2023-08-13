import chalk from 'chalk'
import { readFile, writeFile } from 'fs/promises'

import { createChatCompletion } from '../createChatCompletion.js'
import { GptCliConfig } from '../config/loadConfig.js'
import Mustache from 'mustache'
import { fixedPrompt } from '../prompt/prompt.js'

export async function executeReplaceFileTask({
  apiKey,
  config,
  prompt,
  fileBody,
  filePath,
  write,
}: {
  apiKey: string
  config: GptCliConfig
  prompt: string
  fileBody: string
  filePath: string
  write?: boolean
}) {
  const res = await createChatCompletion(apiKey, config, [
    {
      content: Mustache.render(fixedPrompt[config.lang].replace, { filePath }),
      role: 'user',
    },
    {
      content: prompt,
      role: 'user',
    },
    {
      content: fileBody,
      role: 'user',
    },
  ])
  const reply = res.choices[0]?.message?.content
  if (reply === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  if (write) {
    await overwriteFile(filePath, reply)
  }
  return reply
}

async function overwriteFile(filePath: string, fileBody: string) {
  try {
    await writeFile(filePath, fileBody)
  } catch (e) {
    if (e instanceof Error) {
      console.log(chalk.red(`failed to overwrite file`))
      console.log(chalk.red(e.message))
    }
    process.exit(1)
  }
}
