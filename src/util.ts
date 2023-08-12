export function isDevelopmentMode() {
  return process.env.GPT_CLI_DEBUG_MODE === 'true'
}
