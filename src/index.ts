import { program } from 'commander'
import z from 'zod'
import { execute } from './execute'
import { logger } from './logger'

const argsSchema = z.object({
  prompt: z.string().optional(),
  first: z.boolean().optional(),
  replace: z.string().optional(),
  file: z.string().optional(),
  stdin: z.string().optional(),
})
export type GptCliArgs = z.infer<typeof argsSchema>

function main({ stdin }: { stdin?: string }) {
  program
    .option('--first')
    .option('-r, --replace <char>')
    .option('-f, --file <char>')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      logger.debug('hello world', options.first, prompt)
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
