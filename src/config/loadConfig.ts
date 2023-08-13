import chalk from 'chalk'
import { readFile } from 'fs/promises'
import yaml from 'js-yaml'
import { z } from 'zod'
import { configFilePath, createConfig } from './createConfig.js'
import { logger } from '../logger.js'

const configSchema = z.object({
  openaiApiKey: z.string().optional(),
  model: z.string().optional(),
  lang: z.enum(['ja', 'en']).default('en'),
})
export type GptCliConfig = z.infer<typeof configSchema>

export async function loadConfig() {
  const raw = await readOrCreateConfigFile()
  logger.debug(`raw`, raw)
  const config = yaml.load(raw) ?? {}
  logger.debug(`config`, config)
  const validated = configSchema.safeParse(config)
  if (validated.success) {
    return validated.data
  } else {
    console.log(chalk.red('loading config failed'))
    console.log(chalk.red(validated.error.message))
    console.log(chalk.red('Please check your config file or remove it.'))
    process.exit(1)
  }
}

const readOrCreateConfigFile = async () => {
  logger.debug(`loading`, configFilePath)
  try {
    const raw = await readFile(configFilePath, 'utf8')
    return raw
  } catch (e) {
    console.log(`config file not found, creating...`)
    createConfig()
    return ``
  }
}
