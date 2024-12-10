import { cache } from './cache/cache.js'
export const services = (app) => {
  app.configure(cache)
}
