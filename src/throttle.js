import axios from 'axios'

class Throttle {
  constructor(maxCallsPerMinute) {
    if (this.instance) return this.instance
    this.instance = this

    this.maxCallsPerMinute = maxCallsPerMinute
    this.callQueue = []
    this.callSet = new Set()
    this.callCount = 0
    this.isRunning = false
    this.resetRateLimit()
  }

  resetRateLimit() {
    const intervalId = setInterval(() => {
      if (this.callQueue.length > 0) {
        console.log('Resetting rate limit...')

        this.callCount = 0

        this.callQueue.forEach((call, index) => {
          console.log(
            `Queue Item ${index + 1}: Ticker: ${call.ticker}, Date: ${call.date}, Priority: ${call.priority}`
          )
        })
        this.processQueue()
      } else {
        console.log('No pending calls. Clearing interval...')
        clearInterval(intervalId)
      }
    }, 60000)
  }

  enqueue(ticker, date, priority = 'system') {
    return new Promise((resolve, reject) => {
      const requestKey = `${ticker}_${date}` // Unique key for each request

      // Prevent duplicate requests
      if (this.callSet.has(requestKey)) {
        console.log(`Duplicate request ignored: ${requestKey}`)
        reject(new Error('Duplicate request ignored'))
        return
      }

      // Add to tracking set
      this.callSet.add(requestKey)

      const apiCall = async () => {
        const apiKey = process.env.POLYGON_API_KEY
        const url = `https://api.polygon.io/v1/open-close/${ticker}/${date}`
        try {
          const response = await axios.get(url, {
            params: { apiKey }
          })

          const data = response.data
          console.log('API Response:', { ticker, date, close: data?.close })
          resolve(data)
        } catch (error) {
          // console.error('Error:', error)
          reject(error)
        } finally {
          // Remove from tracking set when the call completes
          this.callSet.delete(requestKey)
        }
      }

      const callData = { apiCall, ticker, date, priority }

      if (priority === 'user') {
        this.callQueue.unshift(callData)
      } else {
        this.callQueue.push(callData)
      }

      this.processQueue()
    })
  }

  async processQueue() {
    if (this.isRunning) return
    this.isRunning = true
    while (this.callQueue.length > 0 && this.callCount < this.maxCallsPerMinute) {
      const { apiCall } = this.callQueue.shift()

      this.callCount++
      await apiCall()
    }

    this.isRunning = false
  }
}
const throttle = new Throttle(5)

export default throttle.enqueue.bind(throttle)
