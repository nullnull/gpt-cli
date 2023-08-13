import chalk from 'chalk'
import { GptCliConfig, loadConfig } from './loadConfig.js'
import { writeFile } from 'fs/promises'
import yaml from 'js-yaml'
import { configFilePath } from './createConfig.js'

export async function registerApiKey(apiKey: string) {
  // validation
  if (!apiKey.startsWith(`sk-`)) {
    console.log(chalk.red(`api key must start with sk-`))
    process.exit(1)
  }

  const currentConfig = await loadConfig()
  const newConfig: GptCliConfig = {
    ...currentConfig,
    openaiApiKey: apiKey,
  }
  await writeConfig(newConfig)
  console.log(`Successfully registered✨ You can use gpt-cli now!`)
  console.log(`API KEY: ${apiKey}`)
}

async function writeConfig(config: GptCliConfig) {
  const text = yaml.dump(config)
  await writeFile(configFilePath, text)
}
