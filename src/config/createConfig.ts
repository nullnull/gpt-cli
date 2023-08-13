import fs from 'fs'
import os from 'os'
import path from 'path'

const homeDir = os.homedir()
const configDir = path.join(homeDir, '.config', 'gpt-cli')
export const configFilePath = path.join(configDir, 'config.yml')

export function createConfig() {
  try {
    // if not config directory, create it
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    // if exits, do nothing, process exits with code 0
    if (fs.existsSync(configFilePath)) {
      return
    }

    fs.writeFileSync(configFilePath, '', { mode: 0o600 })

    console.log(`${configDir} directory and ${configFilePath} file were created.`)
  } catch (e) {
    console.error(`
Error occurred while creating config directory and file.
${e}

  `)

    console.log(`
Please create the following directory and file manually:

mkdir -p ${configDir}
touch ${configFilePath}
  `)

    process.exit(0)
  }
}
