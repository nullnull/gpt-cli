import { Logger } from 'tslog'
import { isDevelopmentMode } from './util.js'

export const logger = new Logger({
  minLevel: isDevelopmentMode() ? 1 : 4,
})
