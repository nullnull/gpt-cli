import { Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi } from 'openai'
import { logger } from './logger'
import { isDevelopmentMode } from './util'

type Message = { content: string; role: 'user' | 'assistant' }
export async function createChatCompletion(apiKey: string, messages: Array<Message>) {
  logger.debug(messages)
  const configuration = new Configuration({
    apiKey,
  })
  const openai = new OpenAIApi(configuration)

  if (isDevelopmentMode()) {
    return generateMockedResponse(messages)
  }

  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
  })

  logger.info(chatCompletion.data)
  return chatCompletion.data
}

const MOCKED_RESPONSE_CONTENT_PREFIX = `[MOCKED] Your prompt is: `
function generateMockedResponse(messages: Message[]): CreateChatCompletionResponse {
  const content = messages[0].content.includes(`JSON`)
    ? JSON.stringify({
        command: 'find src -name *.ts',
        explanation: [MOCKED_RESPONSE_CONTENT_PREFIX, `this is explanation`].join(': '),
      })
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
