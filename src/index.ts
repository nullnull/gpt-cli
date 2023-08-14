import { program } from 'commander'
import z from 'zod'
import { execute } from './execute.js'
import { logger } from './logger.js'
import { registerApiKey } from './config/updateConfig.js'
import { executeConfigTask } from './tasks/executeConfigTask.js'

const chatCommandArgs = z.object({
  type: z.literal(`chat`),
  prompt: z.string().optional(),
  file: z.string().optional(),
  stdin: z.string().optional(),
  write: z.boolean().optional(),
  minimal: z.boolean().optional(),
  verbose: z.boolean().optional(),
})

const commandCommandArgs = z.object({
  type: z.literal(`command`),
  prompt: z.string().optional(),
  interaction: z.boolean(),
  explanation: z.boolean(),
  execute: z.boolean().optional(),
  verbose: z.boolean().optional(),
  version: z.boolean().optional(),
})
const commandsArgs = z.union([chatCommandArgs, commandCommandArgs])
export type GptCliArgs = z.infer<typeof commandsArgs>

function main({ stdin }: { stdin?: string }) {
  program.version('0.1.2')

  // register api key
  program
    .command(`auth`)
    .description(`register openai api key`)
    .argument(
      '<key>',
      'Your openai api key. You can get your own api key from https://platform.openai.com/account/api-keys',
    )
    .action(async (apiKey) => {
      await registerApiKey(apiKey)
    })

  program
    .command(`config`)
    .description(`set config`)
    .action(async () => {
      await executeConfigTask()
    })

  // commandコマンド
  program
    .command(`command`)
    .description(
      `get the command with natural language and execute it.

Usage:

  ai command "find .js files in current directory"`,
    )
    .option('--no-interaction', 'skip interaction', true)
    .option('--no-explanation', 'hide explanation for commands. show command only.', true)
    .option('-e, --execute', '[BE CAREFUL] execute command without confirmation')
    .option('--verbose', 'show debug log')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      logger.debug(options, prompt)
      const args = commandCommandArgs.parse({
        ...options,
        prompt,
        stdin,
        type: 'command',
      })
      logger.debug(args)
      execute(args)
    })

  program
    .description(
      `chat with GPT, or edit file with GPT.

Usage:
    ai "Hello"
    echo "Hello" | ai "translate following English to Japanese"
    ai --file foo.ts --write "Remove all console.log()"
    `,
    )
    .option('-w, --write', '[BE CAREFUL] edit file in-place')
    .option('-m, --minimal', 'supress extra output of GPT')
    .option('-f, --file <char>', 'file path to read')
    .option('--verbose', 'show debug log')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      // logger.debug(options, prompt)
      const args = chatCommandArgs.parse({
        ...options,
        prompt,
        stdin,
        type: 'chat',
      })
      logger.debug(args)
      execute(args)
    })

  program.parse()
}

if (process.stdin.isTTY) {
  main({ stdin: undefined })
} else {
  let stdin = ''
  process.stdin.on('data', function (chunk) {
    stdin += chunk
  })
  process.stdin.on('end', function () {
    main({ stdin })
  })
}
