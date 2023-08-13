import chalk from 'chalk'
import { readFile, writeFile } from 'fs/promises'

import { createChatCompletion } from '../createChatCompletion.js'
import { GptCliConfig } from '../config/loadConfig.js'

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
      // TODO: customize。英語日本語。プログラミング言語の指定。
      // mustacheでいきたい
      content: `テキストファイルの中身をこれから行う指示に合わせて書き換えてください。
出力は書き換えたファイルの中身のみです。それ以外の文字列を含めないでください。
ファイル名：${filePath}
指示：${prompt}
ファイルの中身は次に送ります。
`,
      role: 'user',
    },
    {
      content: fileBody.toString(),
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
