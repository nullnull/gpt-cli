import chalk from 'chalk'
import { GptCliConfig, loadConfig, writeConfig } from './loadConfig.js'

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
