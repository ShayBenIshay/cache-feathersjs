import { polygonApi } from './polygon-api/polygon-api.js'
import { cache } from './cache/cache.js'
export const services = (app) => {
  app.configure(polygonApi)

  app.configure(cache)
}
