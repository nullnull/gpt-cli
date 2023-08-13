import { GptCliConfig, loadConfig, writeConfig } from './loadConfig.js'

export async function registerApiKey(apiKey: string) {
  const currentConfig = await loadConfig()
  const newConfig: GptCliConfig = {
    ...currentConfig,
    openaiApiKey: apiKey,
  }
  await writeConfig(newConfig)
}
