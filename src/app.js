import { feathers } from '@feathersjs/feathers'
import configuration from '@feathersjs/configuration'
import { koa, rest, bodyParser, errorHandler, parseAuthentication, cors, serveStatic } from '@feathersjs/koa'
import socketio from '@feathersjs/socketio'

import { configurationValidator } from './configuration.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'
import { services } from './services/index.js'
import { channels } from './channels.js'

const app = koa(feathers())

app.configure(configuration(configurationValidator))

app.use(
  cors({
    origin: 'http://localhost:3000',
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies and other credentials
  })
)
app.use(serveStatic(app.get('public')))
app.use(errorHandler())
app.use(parseAuthentication())
app.use(bodyParser())

app.configure(rest())
app.configure(
  socketio({
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true
    }
  })
)
app.configure(mongodb)

app.configure(services)
app.configure(channels)

app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
app.hooks({
  setup: [],
  teardown: []
})

export { app }
