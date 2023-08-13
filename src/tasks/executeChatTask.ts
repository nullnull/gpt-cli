import chalk from 'chalk'
import { createChatCompletion } from '../createChatCompletion'

export async function executeChatTask({
  apiKey,
  prompt,
  extraContent,
  filePath,
  minimal,
}: {
  apiKey: string
  prompt: string
  extraContent?: string
  filePath?: string
  minimal?: boolean
}) {
  const minimumizeText = minimal ? `指示に含まれる返答以外は絶対にしないでください。余計な解説は不要です。` : ``
  const messages =
    extraContent !== undefined
      ? [
          {
            content:
              filePath === undefined
                ? `次に送るテキスト文字列について、以下の指示を実行してください。${minimumizeText}
指示：${prompt}`
                : `次に送るファイルの中身について、以下の指示を実行してください。${minimumizeText}
ファイル名：${filePath}
指示：${prompt}`,
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
  const res = await createChatCompletion(apiKey, messages)
  const reply = res.choices[0]?.message?.content
  if (reply === undefined) {
    console.log(chalk.red('no reply'))
    process.exit(1)
  }
  return reply
}
