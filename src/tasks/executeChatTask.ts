import chalk from 'chalk'
import { createChatCompletion } from '../createChatCompletion'

export async function executeChatTask({ apiKey, prompt }: { apiKey: string; prompt: string }) {
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
  return reply
}
