import { foo } from './foo'
import { program } from 'commander'
import z from 'zod'

const argsSchema = z.object({
  prompt: z.string().optional(),
  first: z.boolean().optional(),
  separator: z.string().optional(),
})
type GptCliArgs = z.infer<typeof argsSchema>

function main() {
  program
    .option('--first')
    .option('-s, --separator <char>')
    .argument('<prompt>', 'prompt')
    .action((prompt, options) => {
      console.log('hello world', options.first, prompt)
      const args = argsSchema.parse({
        ...options,
        prompt,
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

main()
