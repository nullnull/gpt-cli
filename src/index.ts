import { program } from 'commander'
import z from 'zod'
import { execute } from './execute'
import { logger } from './logger'

const argsSchema = z.object({
  prompt: z.string().optional(),
  file: z.string().optional(),
  stdin: z.string().optional(),
  replace: z.boolean().optional(),
  minimum: z.boolean().optional(), // gptの返信を最低限のものにし、また表示されるログも最低限にする
  force: z.boolean().optional(),
  command: z.boolean().optional(),
})
export type GptCliArgs = z.infer<typeof argsSchema>

function main({ stdin }: { stdin?: string }) {
  program
    .option('-c, --force')
    .option('--command')
    .option('-m, --minimum')
    .option('-r, --replace')
    .option('-f, --file <char>')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      logger.debug('hello world', options.minimum, prompt)
      const args = argsSchema.parse({
        ...options,
        prompt,
        stdin,
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
