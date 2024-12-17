import enqueue from '../../throttle.js'

export class PolygonApiService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    const { ticker, date, priority = 'system' } = _params.query
    if (!ticker || !date) {
      throw new Error('Both ticker and date are required.')
    }

    try {
      const data = await enqueue(ticker, date, priority)
      console.log('data fetched', data)
      return [{ close: data?.close }]
    } catch (error) {
      console.error('error accured in queue', error)
    }
  }

  async get(id, _params) {
    return {
      id: 0,
      text: `A new message with ID: ${id}!`
    }
  }
  async create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map((current) => this.create(current, params)))
    }

    return {
      id: 0,
      ...data
    }
  }

  // This method has to be added to the 'methods' option to make it available to clients
  async update(id, data, _params) {
    return {
      id: 0,
      ...data
    }
  }

  async patch(id, data, _params) {
    return {
      id: 0,
      text: `Fallback for ${id}`,
      ...data
    }
  }

  async remove(id, _params) {
    return {
      id: 0,
      text: 'removed'
    }
  }
}

export const getOptions = (app) => {
  return { app }
}
