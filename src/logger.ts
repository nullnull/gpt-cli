import { Logger } from 'tslog'
import { isDevelopmentMode } from './util'

export const logger = new Logger({
  minLevel: isDevelopmentMode() ? 1 : 4,
})
