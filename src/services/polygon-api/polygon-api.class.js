import axios from 'axios'

export class PolygonApiService {
  constructor(options) {
    this.options = options
  }

  async find(_params) {
    const { ticker, date } = _params.query
    if (!ticker || !date) {
      throw new Error('Both ticker and date are required.')
    }

    const apiKey = process.env.POLYGON_API_KEY
    const url = `https://api.polygon.io/v1/open-close/${ticker}/${date}`

    try {
      const response = await axios.get(url, {
        params: { apiKey }
      })
      const { close } = response.data

      return [{ close }]
    } catch (error) {
      console.error('Error fetching data from Polygon API:', error)
      throw new Error('Error fetching data from Polygon API')
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
