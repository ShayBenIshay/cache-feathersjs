import { MongoDBService } from '@feathersjs/mongodb'

// By default calls the standard MongoDB adapter service methods but can be customized with your own functionality.
export class CacheService extends MongoDBService {
  async find(params) {
    const { ticker, date } = params.query
    if (!ticker) return { message: 'Missing ticker query param' }
    const queryArr = await super.find({
      query: {
        ticker
      }
    })
    if (queryArr.data.length === 0) {
      return { message: `The ticker ${ticker} is not in cache` }
    }
    if (!date) {
      return queryArr.data[0]
    }

    if (queryArr.data.length > 0) {
      const document = queryArr.data[0]
      const target = document.prices.find((price) => price.date === date)
      if (target) return target
      console.log(`Did not find ${date} in cache`)
    }
    return {}
  }

  async create(data, params) {
    const existing = await this.find({
      query: {
        ticker: data.ticker
      }
    })
    console.log('existing    existing    existing    existing    ')
    console.log(existing)
    if (existing && !existing.message) {
      const existingDocument = existing
      const flag = existingDocument.prices?.some((price) => price.date === data.date)
      if (flag) return existingDocument

      const updatedPricesArr = [...existingDocument.prices, { date: data.date, closePrice: data.closePrice }]

      return this.patch(existingDocument._id, { prices: updatedPricesArr })
    }

    const pricesArr = [{ date: data.date, closePrice: data.closePrice }]
    return super.create({ ticker: data.ticker, prices: pricesArr })
  }
}

export const getOptions = (app) => {
  return {
    paginate: app.get('paginate'),
    Model: app.get('mongodbClient').then((db) => db.collection('cache'))
  }
}
