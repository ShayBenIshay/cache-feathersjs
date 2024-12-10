import '@feathersjs/transport-commons'

export const channels = (app) => {
  app.on('connection', (connection) => {
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {
    if (connection) {
      app.channel('anonymous').leave(connection)
    }
  })
}
