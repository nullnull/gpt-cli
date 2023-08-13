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

  await updateConfig({
    openaiApiKey: apiKey,
  })
  console.log(`Successfully registered✨ You can use gpt-cli now!`)
  console.log(`API KEY: ${apiKey}`)
}

export async function updateConfig(config: Partial<GptCliConfig>) {
  const currentConfig = await loadConfig()
  const newConfig: GptCliConfig = {
    ...currentConfig,
    ...config,
  }
  await writeConfig(newConfig)
}

async function writeConfig(config: GptCliConfig) {
  const text = yaml.dump(config)
  await writeFile(configFilePath, text)
}
