import { program } from 'commander'
import z from 'zod'
import { foo } from './foo'

const argsSchema = z.object({
  prompt: z.string().optional(),
  first: z.boolean().optional(),
  separator: z.string().optional(),
  stdin: z.string().optional(),
})
type GptCliArgs = z.infer<typeof argsSchema>

function main({ stdin }: { stdin?: string }) {
  program
    .option('--first')
    .option('-s, --separator <char>')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      console.log('hello world', options.first, prompt)
      const args = argsSchema.parse({
        ...options,
        prompt,
        stdin,
      })
      console.log(args)
      execute(args)
    })

  program.parse()
}

function execute({ prompt }: GptCliArgs) {
  console.log('prompt:', prompt)
  foo()
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
