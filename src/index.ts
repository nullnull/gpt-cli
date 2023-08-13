import { program } from 'commander'
import z from 'zod'
import { execute } from './execute'
import { logger } from './logger'

const chatCommandArgs = z.object({
  type: z.literal(`chat`),
  prompt: z.string().optional(),
  file: z.string().optional(),
  stdin: z.string().optional(),
  write: z.boolean().optional(),
})

const commandCommandArgs = z.object({
  type: z.literal(`command`),
  prompt: z.string().optional(),
  interaction: z.boolean(),
  execute: z.boolean().optional(),
})
const commandsArgs = z.union([chatCommandArgs, commandCommandArgs])
export type GptCliArgs = z.infer<typeof commandsArgs>

function main({ stdin }: { stdin?: string }) {
  // commandコマンド
  program
    .command(`command`)
    .description(`execute command`)
    .option('--no-interaction', 'description for no-interaction', true)
    .option('-e, --execute')
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
    .option('-w, --write')
    .option('-f, --file <char>')
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
