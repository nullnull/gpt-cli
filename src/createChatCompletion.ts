import { Configuration, CreateChatCompletionRequest, CreateChatCompletionResponse, OpenAIApi } from 'openai'
import { logger } from './logger'
import { isDevelopmentMode } from './util'

type Message = { content: string; role: 'user' | 'assistant' }
export async function createChatCompletion(apiKey: string, messages: Array<Message>) {
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
          content: [MOCKED_RESPONSE_CONTENT_PREFIX, messages.map((x) => x.content).join('\n')].join(': '),
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