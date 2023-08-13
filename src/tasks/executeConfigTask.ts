import inquirer from 'inquirer'
import { z } from 'zod'
import { loadConfig } from '../config/loadConfig.js'
import { logger } from '../logger.js'
import { updateConfig } from '../config/updateConfig.js'

export async function executeConfigTask() {
  const config = await loadConfig()

  const { model } = await inquirer.prompt({
    type: 'list',
    name: 'model',
    default: config.model,
    message: `🤖 Which model do you want to use?`,
    choices: [
      {
        name: 'gpt-3.5-turbo',
        value: 'gpt-3.5-turbo',
      },
      {
        name: 'gpt-4',
        value: 'gpt-4',
      },
    ],
  })
  logger.debug({ model })

  await updateConfig({
    model,
  })
  console.log(`Updated config`)
}
