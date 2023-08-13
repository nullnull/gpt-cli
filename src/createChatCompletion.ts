import { Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi } from 'openai'
import { logger } from './logger.js'
import { isDevelopmentMode } from './util.js'
import chalk from 'chalk'
import { Spinner } from 'cli-spinner'
import { GptCliConfig } from './config/loadConfig.js'

type Message = { content: string; role: 'user' | 'assistant' }
export async function createChatCompletion(apiKey: string, config: GptCliConfig, messages: Array<Message>) {
  logger.debug(messages)
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)

  if (isDevelopmentMode()) {
    return generateMockedResponse(messages)
  }

  try {
    const payload = {
      model: config.model ?? 'gpt-3.5-turbo',
      messages,
    }
    logger.info(`payload`, payload)
    const spinner = new Spinner(chalk.greenBright('%s '))
    spinner.setSpinnerString(18)
    spinner.start()
    const chatCompletion = await openai.createChatCompletion(payload)
    spinner.stop(true)
    logger.info(`response`, chatCompletion.data)
    return chatCompletion.data
  } catch (e) {
    if ((e as any).isAxiosError) {
      const axiosError = e as any
      const message = axiosError.response.data.error.message
      if (message !== undefined) {
        console.error(chalk.red(message))
      } else {
        console.error(axiosError.response.data)
      }
    } else if (e instanceof Error) {
      console.log(chalk.red(e.message))
    }
    process.exit(1)
  }
}

const MOCKED_RESPONSE_CONTENT_PREFIX = `[MOCKED] Your prompt is: `
function generateMockedResponse(messages: Message[]): CreateChatCompletionResponse {
  const content = messages[0].content.includes(`改行を2つ以上`)
    ? `find src -name *.ts

      this is mocked explanation`
    : messages[0].content.includes(`コマンドを生成`)
    ? 'find src -name *.ts'
    : [MOCKED_RESPONSE_CONTENT_PREFIX, messages.map((x) => x.content).join('\n')].join(': ')
  return {
    id: 'chatcmpl-7meZCVU3RKM3ctNSvigAPCVJYx8G7',
    object: 'chat.completion',
    created: 1691830038,
    model: 'gpt-3.5-turbo-0613',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 8,
      completion_tokens: 9,
      total_tokens: 17,
    },
  }
}
