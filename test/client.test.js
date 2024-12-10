import assert from 'assert'
import axios from 'axios'

import rest from '@feathersjs/rest-client'
import { app } from '../src/app.js'
import { createClient } from '../src/client.js'

const port = app.get('port')
const appUrl = `http://${app.get('host')}:${port}`

describe('application client tests', () => {
  const client = createClient(rest(appUrl).axios(axios))

  before(async () => {
    await app.listen(port)
  })

  after(async () => {
    await app.teardown()
  })

  it('initialized the client', () => {
    assert.ok(client)
  })
})
